import { Controller, Body, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service'
import { ApiBasicAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/dto/jwt.guard';


@UseGuards(JwtAuthGuard)
@ApiBasicAuth()
@Controller('user')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    // @Post('signup')
    // @ApiOperation({ summary: 'Criar um novo usuario' }) // um resumo do que essa rota faz 
    // @ApiBody({ type: createUserDto }) // corpo da requisição 
    // @ApiResponse({ status: 201, description: 'Usuario criado com sucesso!' }) // resposta do api
    // create(@Body() data: createUserDto) {
    //     try {
    //         return this.userService.create(data);
    //     } catch (error) {
    //         return {
    //             error: error
    //         }
    //     }
    // }

    @Get()
    @ApiOperation({ summary: 'Mostra todos os usuarios do banco de dado!' })
    @ApiResponse({ status: 200, description: 'tarefa comcluida com sucesso!' })
    findAll() {
        return this.userService.findAll()
    }

    @Get(':id')
    @ApiOperation({ summary: 'Mostra o usuarios que tem o ID especifico!' })
    @ApiResponse({ status: 200, description: 'tarefa comcluida com sucesso!' })
    @ApiResponse({ status: 404, description: 'Usuario não encontrado' })
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id)
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualiza os dados de um usuario especificado pelo ID!' })
    @ApiResponse({ status: 200, description: 'Usuario atualizado!' })
    @ApiResponse({ status: 404, description: 'Usuario não encontrado' })
    updateUser(
        @Param('id') id: string,
        @Body() UserData: any
    ) {
        return this.userService.update(id, UserData)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deletar um usuario do banco de dados' })
    @ApiResponse({ status: 200, description: 'Usuario deletado!' })
    @ApiResponse({ status: 404, description: 'Usuario não encontrado' })
    remove(
        @Param('id') id: string
    ) {
        return this.userService.remove(id)
    }
}
