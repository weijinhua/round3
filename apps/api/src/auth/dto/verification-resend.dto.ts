import { IsEmail } from 'class-validator';

export class VerificationResendDto {
  @IsEmail()
  email!: string;
}

