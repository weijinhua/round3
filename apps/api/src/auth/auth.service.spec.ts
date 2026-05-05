import { AuthService } from './auth.service';
process.env.DISABLE_QUEUE = '1';
import { User } from './entities/user.entity';
import { Session } from './entities/session.entity';

describe('AuthService (unit)', () => {
  const users: User[] = [];
  const sessions: Session[] = [];

  const usersRepo = {
    findOne: async ({ where: { email } }: any) => users.find((u) => u.email === email) || null,
    create: (data: any) => ({ ...data }),
    save: async (u: any) => {
      if (!u.id) u.id = `id-${users.length + 1}`;
      users.push(u);
      return u;
    },
  };

  const sessionsRepo = {
    create: (data: any) => ({ ...data }),
    save: async (s: any) => {
      sessions.push(s);
      return s;
    },
    delete: async (cond: any) => {
      const idx = sessions.findIndex((s) => s.sessionId === cond.sessionId);
      if (idx >= 0) sessions.splice(idx, 1);
    },
  };

  const service = new AuthService(usersRepo as any, sessionsRepo as any);

  it('register should create user and not expose password', async () => {
    const res = await service.register('alice@example.com', 'Password1');
    expect(res).toEqual({ message: 'verification_sent' });
    expect(users.length).toBe(1);
    expect(users[0].email).toBe('alice@example.com');
  });

  it('login throws for unverified account', async () => {
    await expect(service.login('alice@example.com', 'Password1')).rejects.toThrow();
  });

  it('login succeeds for verified account', async () => {
    // mark existing user verified and attempt login
    users[0].verified = true;
    const tokens = await service.login('alice@example.com', 'Password1');
    expect(tokens).toHaveProperty('accessToken');
    expect(tokens).toHaveProperty('refreshToken');
  });
});

