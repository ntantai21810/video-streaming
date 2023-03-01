import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() payload: LogInDto) {
    return this.authService.login(payload);
  }

  @Post('/sign-up')
  async signup(@Body() payload: SignUpDto) {
    return this.authService.signup(payload);
  }
}
