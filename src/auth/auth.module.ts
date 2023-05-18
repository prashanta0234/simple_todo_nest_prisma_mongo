import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './gurd/auth.gurd';
import { JwtStrategy } from './strategies/jwt.strategies';

@Module({
  imports: [JwtModule.register({}), PassportModule],
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
