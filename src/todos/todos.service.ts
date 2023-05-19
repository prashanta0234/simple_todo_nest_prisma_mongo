import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { todoDto } from './dto/todo.dto';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  // get all todos
  async getTodos(data: any) {
    const todos = await this.prisma.todos.findMany({
      where: {
        userId: data.id,
      },
    });
    return todos;
  }

  // create todos
  async createTodo(data: todoDto) {
    await this.prisma.todos.create({
      data: {
        userId: data.userId,
        title: data.title,
        des: data.des,
      },
    });
  }

  // get single todo
  async getTodo(todoId: string) {
    return this.prisma.todos.findUnique({
      where: {
        id: todoId,
      },
    });
  }

  // delete todo
  async deleteTodo(todoId: string) {
    return this.prisma.todos.delete({
      where: {
        id: todoId,
      },
    });
  }
}
