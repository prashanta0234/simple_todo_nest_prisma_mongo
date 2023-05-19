import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';

import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [AuthModule, TodosModule, PrismaModule],
  providers: [PrismaService],
})
export class AppModule {}
