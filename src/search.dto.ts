import { IsNotEmpty, IsString } from 'class-validator';

import type { Search } from './search.interface';

class SearchRequestDto {
    @IsNotEmpty()
    @IsString()
    keyword: string;
}

class SearchResponseDto {
    keyword: string;
    searchCount: number;

    constructor({ keyword, searchCount }: Search) {
        this.keyword = keyword;
        this.searchCount = searchCount;
    }

    static of(search: Search) {
        return new SearchResponseDto(search);
    }
}

export { SearchRequestDto, SearchResponseDto };
