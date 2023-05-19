import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { TodoService } from './todos.service';
import { todoDto } from './dto/todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private todoService: TodoService) {}

  @Get()
  async allTodos(@Req() req: Request) {
    const data = req.user;
    // console.log(req);
    const todos = await this.todoService.getTodos(data);
    return todos;
  }

  @HttpCode(200)
  @Post()
  async createTodo(@Body() data: todoDto) {
    await this.todoService.createTodo(data);
  }

  @Get('/:id')
  async getTodo(@Param() params: any) {
    return await this.todoService.getTodo(params.id);
  }

  @Delete('/:id')
  async deleteTodo(@Param() params: any) {
    await this.todoService.deleteTodo(params.id);
  }
}
