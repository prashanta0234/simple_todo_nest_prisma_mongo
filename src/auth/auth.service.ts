import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { userDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private JwtService: JwtService) {}

  // signup
  async signup(data: userDto) {
    const isExists = await this.prisma.users.findUnique({
      where: {
        email: data.email,
      },
    });
    if (isExists) {
      throw new BadRequestException('User already exists');
    }

    const hash = await bcrypt.hash(data.password, 15);

    const AT = await this.accessToken({ email: data.email, password: hash });
    const RT = await this.refreshToken(AT);

    const user = await this.prisma.users.create({
      data: {
        email: data.email,
        password: hash,
        name: data.name,
        refreshToken: RT,
      },
    });
    return { id: user.id, email: user.email, accessToken: AT };
  }

  // login

  async login(data: userDto) {
    const isExists = await this.prisma.users.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!isExists) {
      throw new BadRequestException('User not exists');
    }
    // const convertHash = await bcrypt.hash(data.password, 15);
    const isValid = await bcrypt.compare(data.password, isExists.password);
    if (!isValid) {
      throw new ForbiddenException('Wrong password');
    }
    const AT = await this.accessToken({
      email: data.email,
      password: isExists.password,
    });
    const RT = await this.refreshToken(AT);

    const updateRt = await this.prisma.users.update({
      where: {
        id: isExists.id,
      },
      data: {
        refreshToken: RT,
      },
    });

    return { email: updateRt.email, id: updateRt.id, accessToken: AT };
  }

  // logout
  async logout(data: any) {
    await this.prisma.users.update({
      where: {
        email: data.email,
      },
      data: {
        refreshToken: null,
      },
    });
  }

  // refresh token
  async refresh(data: any) {
    const getToken = await this.prisma.users.findUnique({
      where: { email: data.email },
    });
    if (!getToken) {
      throw new ForbiddenException('User not exists');
    }
    if (getToken.refreshToken == null) {
      throw new ForbiddenException('please login Again');
    }
    const token = await this.accessToken({
      email: getToken.email,
      password: getToken.password,
    });
    return { accessToken: token };
  }

  // for accessToken
  async accessToken(data: userDto) {
    const jwtToken = await this.JwtService.signAsync(
      {
        email: data.email,
        password: data.password,
      },
      { secret: 'ACCESS_SECRET', expiresIn: 15 * 60 },
    );
    return jwtToken;
  }

  // for refresh token
  async refreshToken(token: string) {
    const validToken = await this.JwtService.verifyAsync(token, {
      secret: 'ACCESS_SECRET',
    });
    const jwtToken = await this.JwtService.signAsync(
      {
        email: validToken.email,
        password: validToken.password,
      },
      { secret: 'REFRESH_SECRET', expiresIn: 60 * 60 * 24 * 7 },
    );
    return jwtToken;
  }
}
