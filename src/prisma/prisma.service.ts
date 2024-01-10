import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    constructor() {
        super({
            log: [
                'info',
                // { emit: 'stdout', level: 'query' },
                // { emit: 'stdout', level: 'error' },
            ],
        });
    }

    async onModuleInit() {
        await this.$connect();
        await this.$queryRaw`SELECT 1`;
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
