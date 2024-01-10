import { Test, TestingModule } from '@nestjs/testing';

import { PrismaModule } from './prisma/prisma.module';
import { SearchRepository } from './search.repository';

describe('SearchRepository Test', () => {
    let searchRepository: SearchRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule],
            providers: [SearchRepository],
        }).compile();

        searchRepository = module.get<SearchRepository>(SearchRepository);
    });

    it('create search when keyword is not exists', async () => {
        const actual = await searchRepository.upsert('keyword');
        const { id, keyword } = await searchRepository[
            'prisma'
        ].searchKeyword.findFirst({ where: { keyword: 'keyword' } });

        expect(keyword).toBe<string>('keyword');
        expect(actual).toStrictEqual({ id, version: 0 });
    });

    it('increaseSearchCount', async () => {
        const actual = await searchRepository.increaseSearchCount(
            await searchRepository.upsert('isAlreadyKeyword'),
        );

        expect(actual).toStrictEqual({
            searchCount: 2,
            keyword: 'isAlreadyKeyword',
        });
    });
});
