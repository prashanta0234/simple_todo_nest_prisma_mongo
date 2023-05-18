import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { userDto } from './dto/user.dto';

import { Public } from './decorator/auth.decorator';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signup')
  @HttpCode(200)
  async signUp(@Body() data: userDto) {
    return await this.authService.signup(data);
  }

  @Public()
  @Post('/login')
  async login(@Body() data: userDto) {
    return await this.authService.login(data);
  }

  @Post('/logout')
  async logout(@Req() req: Request) {
    const data = req.user;
    await this.authService.logout(data);
  }

  @Post('/refresh')
  async refresh(@Req() req: Request) {
    const data = req.user;
    return await this.authService.refresh(data);
  }
}
