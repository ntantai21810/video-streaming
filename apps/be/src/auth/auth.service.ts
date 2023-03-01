import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtSerivce: JwtService) {}

  async login(username: string, password) {
    return {
      access_token: this.jwtSerivce.sign({ username }),
    };
  }
}
