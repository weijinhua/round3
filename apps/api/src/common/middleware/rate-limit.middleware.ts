import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter for demonstration. For production use Redis-backed limiter.
const windowMs = 60 * 1000; // 1 minute
const maxRequests = 60;
const store = new Map<string, { count: number; resetAt: number }>();

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const key = req.ip || req.headers['x-forwarded-for'] || 'global';
    const entry = store.get(String(key)) || { count: 0, resetAt: Date.now() + windowMs };
    if (Date.now() > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = Date.now() + windowMs;
    }
    entry.count += 1;
    store.set(String(key), entry);
    res.setHeader('X-RateLimit-Limit', String(maxRequests));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, maxRequests - entry.count)));
    if (entry.count > maxRequests) {
      res.status(HttpStatus.TOO_MANY_REQUESTS).json({ error: 'rate_limited' });
      return;
    }
    next();
  }
}
