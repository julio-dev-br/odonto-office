import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Gestão de Usuários e Acessos')
@ApiBearerAuth()
@Controller('users')
@UseGuards(RolesGuard)
@Roles('ADMIN') 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastra um novo usuário/colaborador atrelado à clínica atual' })
  async create(@Body() body: any) {
    return this.usersService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os colaboradores vinculados à clínica' })
  async findAll() {
    return this.usersService.findAll();
  }

}
