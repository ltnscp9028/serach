import { Test, TestingModule } from '@nestjs/testing';

import { PrismaModule } from './prisma/prisma.module';
import { SearchRepository } from './search.repository';
import { SearchService } from './search.service';
import { SearchResponseDto } from './search.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

describe('SearchService Test', () => {
    let searchService: SearchService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule],
            providers: [SearchService, SearchRepository],
        }).compile();

        searchService = module.get<SearchService>(SearchService);
    });

    it('create search when keyword is not exists', async () => {
        const actual = await searchService.save('4dbbb95d');

        expect(actual).toStrictEqual(
            SearchResponseDto.of({
                keyword: '4dbbb95d',
                searchCount: 2,
            }),
        );
    });

    it('increase seachCount when keyword is exists', async () => {
        await searchService.save('fbc63d43');
        const actual = await searchService.save('fbc63d43');

        expect(actual).toStrictEqual(
            SearchResponseDto.of({ keyword: 'fbc63d43', searchCount: 3 }),
        );
    });

    it('rejects second service call when concurrent call ', async () => {
        await searchService.save('3a514d7d');

        //before two call cause Prisma Bug
        await Promise.allSettled([
            searchService.save('3a514d7d'),
            searchService.save('3a514d7d'),
        ]);

        const allSettled = await Promise.allSettled([
            searchService.save('3a514d7d'),
            searchService.save('3a514d7d'),
        ]);

        allSettled.forEach(result => {
            switch (result.status) {
                case 'fulfilled':
                    {
                        expect(result.value).toStrictEqual(
                            SearchResponseDto.of({
                                keyword: '3a514d7d',
                                searchCount: 5,
                            }),
                        );
                    }
                    break;

                case 'rejected':
                    {
                        expect(result.reason).toBeInstanceOf(
                            PrismaClientKnownRequestError,
                        );
                    }
                    break;
            }
        });
    });
});
