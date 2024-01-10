import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { SearchController } from './seach.controller';
import { SearchService } from './search.service';
import { SearchRepository } from './search.repository';

@Module({
    imports: [PrismaModule],
    controllers: [SearchController],
    providers: [SearchService, SearchRepository],
})
export class AppModule {}
