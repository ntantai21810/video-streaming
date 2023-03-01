import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LogInDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import {
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_LIFETIME,
} from '@code/shared/constants/token';

@Injectable()
export class AuthService {
  constructor(
    private jwtSerivce: JwtService,
    private userService: UserService
  ) {}

  async login(payload: LogInDto) {
    const user = await this.userService.findByEmail(payload.email);
    if (!user) throw new BadRequestException('User not found');

    const matchPassword = await bcrypt.compare(payload.password, user.password);
    if (!matchPassword) throw new BadRequestException('Wrong password.');

    delete user.password;

    const accessToken = this.jwtSerivce.sign(user, {
      expiresIn: ACCESS_TOKEN_LIFETIME,
    });
    const refreshToken = this.jwtSerivce.sign(user, {
      expiresIn: REFRESH_TOKEN_LIFETIME,
    });

    await this.userService.update(user.id, { refreshToken });

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }

  async signup(payload: SignUpDto) {
    const user = await this.userService.findByEmail(payload.email);
    if (user) throw new BadRequestException('User already exists.');

    const hash = await bcrypt.hash(payload.password, 10);

    const newUser = await this.userService.create({
      ...payload,
      password: hash,
    });

    delete newUser.password;

    const accessToken = this.jwtSerivce.sign(newUser, {
      expiresIn: ACCESS_TOKEN_LIFETIME,
    });
    const refreshToken = this.jwtSerivce.sign(newUser, {
      expiresIn: REFRESH_TOKEN_LIFETIME,
    });

    await this.userService.update(newUser.id, { refreshToken });

    return {
      ...newUser,
      accessToken,
      refreshToken,
    };
  }
}
