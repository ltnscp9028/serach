import { Controller, Post, Body } from '@nestjs/common';

import { SearchService } from './search.service';
import { SearchRequestDto } from './search.dto';

@Controller('search')
export class SearchController {
    constructor(private readonly appService: SearchService) {}

    @Post()
    search(@Body() { keyword }: SearchRequestDto) {
        return this.appService.save(keyword);
    }
}
