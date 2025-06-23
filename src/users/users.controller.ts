import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service'


@Controller('user')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post('signup')
    create(@Body() data: any) {
        try {
            return this.userService.create(data);
        } catch (error) {
            return {
                error: error
            }
        }

    }

    @Get()
    findAll() {
        return this.userService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id)
    }

    @Put(':id')
    updateUser(
        @Param('id') id: string,
        @Body() UserData: any
    ) {
        return this.userService.update(id, UserData)
    }

    @Delete(':id')
    remove(
        @Param('id') id: string
    ) {
        return this.userService.remove(id)
    }
}
