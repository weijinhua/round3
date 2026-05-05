import { AuthService } from '../../../../apps/api/src/auth/auth.service';
process.env.DISABLE_QUEUE = '1';

describe('password-reset story', () => {
  it('requests and confirms password reset', async () => {
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
    const sessionsRepo = { create: () => ({}), save: async () => ({}), delete: async () => {} };
    const service = new AuthService(usersRepo as any, sessionsRepo as any);
    await service.register('carol@example.com', 'Password1');
    // request reset should succeed even if user exists
    const req = await service.requestPasswordReset('carol@example.com');
    expect(req).toEqual({ message: 'reset_requested' });
    // confirm with invalid token should fail
    await expect(service.confirmPasswordReset('invalid', 'NewPass1')).rejects.toThrow();
  });
});
