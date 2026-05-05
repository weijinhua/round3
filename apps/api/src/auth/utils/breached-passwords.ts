const COMMON_BREACHED_PASSWORDS = new Set([
  '123456',
  'password',
  '123456789',
  'qwerty',
  '111111',
]);

export function isBreachedPassword(pw: string): boolean {
  if (!pw) return false;
  return COMMON_BREACHED_PASSWORDS.has(pw);
}

export function addToLocalBlocklist(pw: string) {
  COMMON_BREACHED_PASSWORDS.add(pw);
}

