export const SecurityLogger = {
  failedLogin: (email: string, ip?: string) => {
    console.warn(`[security] failed login for ${email} from ${ip || 'unknown'}`);
  },
  passwordResetRequested: (email: string) => {
    console.info(`[security] password reset requested for ${email}`);
  },
  verificationAttempt: (email: string, success: boolean) => {
    console.info(`[security] verification attempt for ${email} success=${success}`);
  },
};
