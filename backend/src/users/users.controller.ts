import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) { }

    @Get()
    findAll(): Promise<User[]> {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(Number(id));
    }

    @Post()
    create(@Body() body: Partial<User>) {
        return this.service.create(body);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: Partial<User>) {
        return this.service.update(Number(id), body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(Number(id));
    }
}
