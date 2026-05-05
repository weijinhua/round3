import { Controller, Post, Body, UsePipes, ValidationPipe, Req, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { PasswordResetConfirmDto } from './dto/password-reset-confirm.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() body: RegisterDto) {
    return { data: await this.authService.register(body.email, body.password), error: null };
  }

  @Post('verify')
  @UsePipes(new ValidationPipe({ transform: true }))
  async verify(@Body() body: VerifyDto) {
    await this.authService.verify(body.token);
    return { data: { message: 'verified' }, error: null };
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() body: LoginDto) {
    const tokens = await this.authService.login(body.email, body.password);
    return { data: tokens, error: null };
  }

  @Post('logout')
  async logout(@Headers('x-session-id') sessionId: string) {
    await this.authService.logout(sessionId);
    return { data: { message: 'logged_out' }, error: null };
  }

  @Post('password-reset/request')
  @UsePipes(new ValidationPipe({ transform: true }))
  async requestPasswordReset(@Body() body: PasswordResetRequestDto) {
    const res = await this.authService.requestPasswordReset(body.email);
    return { data: res, error: null };
  }

  @Post('password-reset/confirm')
  @UsePipes(new ValidationPipe({ transform: true }))
  async confirmPasswordReset(@Body() body: PasswordResetConfirmDto) {
    const res = await this.authService.confirmPasswordReset(body.token, body.newPassword);
    return { data: res, error: null };
  }
}

