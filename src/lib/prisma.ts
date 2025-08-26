import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// 本番環境以外ではグローバルに保存してホットリロード時の再接続を防ぐ
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// graceful shutdown
process.on('beforeExit', async () => {
  console.log('🔌 Disconnecting Prisma...');
  await prisma.$disconnect();
});