import { Module } from '@nestjs/common';

import { TodosController } from './todos.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TodoService } from './todos.service';
// import { TodoService } from './todos.service';

@Module({
  providers: [TodoService, PrismaService],
  controllers: [TodosController],
})
export class TodosModule {}
