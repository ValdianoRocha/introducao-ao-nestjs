import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service'
import { createUserDto } from './user.dto';
@Controller('users')
export class UsersController {
    constructor(private userService:UsersService){}

    @Get()
    findAll(){
        return this.userService.findAllUser()
    }
    @Get('/:id')
    findFromId(@Param('id') id:string){
        return this.userService.findIdUser(Number(id))
    }
    @Post()
    createUser(@Body() userCreate:createUserDto ){
        const {name,email} = userCreate
        return this.userService.createUser(name,email)
    }
    @Put(':id')
    UpdateUser(@Param('id') id:string,  @Body() userCreate:createUserDto){
        const {name,email} = userCreate
        return this.userService.atualizaUsuario(Number(id),name,email)

    }
    @Delete(':id')
    DeleteUser(@Param('id') id:string){
        return this.userService.deletarUsuario(Number(id))
    }
}
