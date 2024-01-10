import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v4 } from 'uuid';

import { PrismaService } from './prisma/prisma.service';
import type { PrismaTxType } from './prisma/prisma.type';

@Injectable()
export class SearchRepository {
    constructor(private readonly prisma: PrismaService) {}

    upsert(keyword: string, tx?: PrismaTxType) {
        return (tx ?? this.prisma).searchKeyword
            .upsert({
                where: { keyword },
                update: {},
                create: { id: v4(), keyword, searchCount: 1, version: 0 },
            } satisfies Prisma.SearchKeywordUpsertArgs)
            .then(({ id, version }) => ({
                id,
                version,
            }));
    }

    increaseSearchCount(
        { id, version }: { id: string; version: number },
        tx?: PrismaTxType,
    ) {
        return (tx ?? this.prisma).searchKeyword
            .update({
                where: { id, version },
                data: {
                    searchCount: { increment: 1 },
                    version: { increment: 1 },
                },
            })
            .then(({ keyword, searchCount }) => ({ keyword, searchCount }));
    }
}
