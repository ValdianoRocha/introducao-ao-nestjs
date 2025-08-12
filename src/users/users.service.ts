import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { promises } from 'dns';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({ data });
    }

    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany()
    }

    async findOne(id: string): Promise<User | null> {
        const foundUser = await this.prisma.user.findUnique({
            where: { id }
        })

        if (!foundUser) {
            //lancar um erro
            throw new NotFoundException(`Usuário com o ID ${id} não encontrado!`)
        }
        return foundUser
    }

    async update(id: string, userData: Prisma.UserUpdateInput): Promise<User | null> {
        const updateUser = await this.prisma.user.update({
            where: { id },
            data: userData
        })
        if (!updateUser) {
            throw new NotFoundException(`Usuário com o ID ${id} não encontrado!`)
        }
        return updateUser
    }

    async remove(id: string): Promise<User | null> {
        try {
            return await this.prisma.user.delete({
                where: { id }
            })

        } catch (error) {
            throw new NotFoundException(`Usuário com o ID ${id} não encontrado!`)
        }
    }

}
