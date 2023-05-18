import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { TodosModule } from './todos/todos.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, TodosModule, PrismaModule],
  providers: [PrismaService],

  // providers: [AppService],
})
export class AppModule {}
