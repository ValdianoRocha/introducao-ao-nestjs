import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() { // iniciar com o banco de dados 
        await this.$connect();
    }

    async onModuleDestroy() { // encerrar a conecção com o banco de dados 
        await this.$disconnect();
    }
}