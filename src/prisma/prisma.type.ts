import type { PrismaService } from './prisma.service';
type PrismaTxType = Parameters<Parameters<PrismaService['$transaction']>[0]>[0];

export { PrismaTxType };
