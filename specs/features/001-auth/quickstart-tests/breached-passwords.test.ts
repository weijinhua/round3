import { describe, it, expect } from 'vitest';
import { isBreachedPassword } from '../../../../apps/api/src/auth/utils/breached-passwords';

describe('Breached password blocklist', () => {
  it('detects common breached passwords', () => {
    expect(isBreachedPassword('123456')).toBe(true);
    expect(isBreachedPassword('uniqueStrongPass!23')).toBe(false);
  });
});

