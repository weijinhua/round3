import { IsString, Length, Matches } from 'class-validator';

export class PasswordResetConfirmDto {
  @IsString()
  token: string;

  @IsString()
  @Length(8, 128)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, { message: 'Password must include letters and numbers' })
  newPassword: string;
}

