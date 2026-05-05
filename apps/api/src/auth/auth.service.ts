import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import Redis from 'ioredis';
import { randomUUID } from 'crypto';
import { User } from './entities/user.entity';
import { Session } from './entities/session.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Session) private readonly sessionsRepo: Repository<Session>,
  ) {}

  private createRedisClient() {
    if (process.env.DISABLE_QUEUE === '1') {
      // no-op stub for tests and disabled environments
      return {
        rpush: async () => 0,
        set: async () => 'OK',
        keys: async () => [] as string[],
        del: async () => 0,
        quit: async () => {},
      } as unknown as Redis;
    }
    return new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  async register(email: string, password: string) {
    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) {
      // Do not reveal existence
      return { message: 'verification_sent' };
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = this.usersRepo.create({ email, passwordHash });
    await this.usersRepo.save(user);
    // generate signed verification token and enqueue verification email
    const token = (jwt as any).sign(
      { sub: user.id, t: 'verify' },
      process.env.JWT_SECRET || 'changeme-jwt-secret',
      { expiresIn: process.env.JWT_VERIFICATION_EXPIRES_IN || '1h' },
    );
    try {
    const redis = this.createRedisClient();
      await redis.rpush(
        'mail:queue',
        JSON.stringify({
          email: user.email,
          subject: 'Verify your email',
          html: `<p>Please verify your account by POSTing this token to /api/v1/auth/verify</p><pre>${token}</pre>`,
        }),
      );
      await redis.quit();
    } catch (err) {
      // best-effort: don't fail registration if mail enqueue fails (tests/local without Redis)
      console.error('mail enqueue failed', err);
    }
    return { message: 'verification_sent' };
  }

  async verify(token: string) {
    try {
      const payload = (jwt as any).verify(token, process.env.JWT_SECRET || 'changeme-jwt-secret') as any;
      if (payload?.t !== 'verify' || !payload?.sub) throw new Error('invalid token');
      const user = await this.usersRepo.findOne({ where: { id: payload.sub } });
      if (!user) throw new BadRequestException('Invalid token');
      if (!user.verified) {
        user.verified = true;
        await this.usersRepo.save(user);
      }
      return { message: 'verified' };
    } catch (err) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.verified) throw new UnauthorizedException('Account not verified');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    // create session and refresh token stored in Redis
    const tokenId = randomUUID();
    const accessToken = (jwt as any).sign(
      { sub: user.id, t: 'access' },
      process.env.JWT_SECRET || 'changeme-jwt-secret',
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' },
    );
    const refreshExpires = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    const now = Date.now();
    const expiresAt = new Date(now + 7 * 24 * 60 * 60 * 1000); // fallback 7 days
    const session = this.sessionsRepo.create({
      userId: user.id,
      sessionId: tokenId,
      issuedAt: new Date(),
      expiresAt,
    });
    await this.sessionsRepo.save(session);
    try {
    const redis = this.createRedisClient();
      const key = `refresh:${user.id}:${tokenId}`;
      await redis.set(key, JSON.stringify({ sessionId: tokenId }), 'EX', 7 * 24 * 60 * 60);
      await redis.quit();
    } catch (err) {
      console.error('redis set failed', err);
    }
    return { accessToken, refreshToken: tokenId, expiresIn: 15 * 60 };
  }

  async logout(sessionId: string) {
    // remove session row and Redis key prefix match
    await this.sessionsRepo.delete({ sessionId });
    try {
    const redis = this.createRedisClient();
      // Best-effort: attempt to delete known pattern key for the session
      const keys = await redis.keys(`refresh:*:${sessionId}`);
      if (keys.length) {
        await redis.del(...keys);
      }
      await redis.quit();
    } catch (err) {
      console.error('redis delete failed', err);
    }
    return { message: 'logged_out' };
  }

  async requestPasswordReset(email: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    // Always return success to avoid user enumeration
    if (!user) return { message: 'reset_requested' };
    const token = (jwt as any).sign(
      { sub: user.id, t: 'password_reset' },
      process.env.JWT_SECRET || 'changeme-jwt-secret',
      { expiresIn: process.env.JWT_PASSWORD_RESET_EXPIRES_IN || '1h' },
    );
    try {
    const redis = this.createRedisClient();
      await redis.rpush(
        'mail:queue',
        JSON.stringify({
          email: user.email,
          subject: 'Password reset',
          html: `<p>Use this token to reset your password:</p><pre>${token}</pre>`,
        }),
      );
      await redis.quit();
    } catch (err) {
      console.error('mail enqueue failed', err);
    }
    return { message: 'reset_requested' };
  }

  async confirmPasswordReset(token: string, newPassword: string) {
    try {
      const payload = (jwt as any).verify(token, process.env.JWT_SECRET || 'changeme-jwt-secret') as any;
      if (payload?.t !== 'password_reset' || !payload?.sub) throw new Error('invalid token');
      const user = await this.usersRepo.findOne({ where: { id: payload.sub } });
      if (!user) throw new BadRequestException('Invalid token');
      user.passwordHash = await bcrypt.hash(newPassword, 12);
      await this.usersRepo.save(user);
      return { message: 'password_reset' };
    } catch (err) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}

