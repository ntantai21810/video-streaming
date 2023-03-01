import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  create(payload: CreateUserDto) {
    return this.prismaService.user.create({ data: payload });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  update(id: number, payload: UpdateUserDto) {
    return this.prismaService.user.update({ where: { id }, data: payload });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
