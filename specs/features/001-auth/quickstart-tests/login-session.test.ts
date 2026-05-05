/// <reference types="jest" />
import { AuthService } from '../../../../apps/api/src/auth/auth.service';
process.env.DISABLE_QUEUE = '1';

describe('login→session→logout story', () => {
  it('login issues tokens and logout removes session', async () => {
    const users: any[] = [];
    const sessions: any[] = [];
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
    await service.register('bob@example.com', 'Password1');
    users[0].verified = true;
    const tokens = await service.login('bob@example.com', 'Password1');
    expect(tokens).toHaveProperty('accessToken');
    expect(tokens).toHaveProperty('refreshToken');
    await service.logout(tokens.refreshToken);
    // session should be removed from sessionsRepo
    expect(sessions.length).toBe(0);
  });
});
