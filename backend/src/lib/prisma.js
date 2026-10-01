import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

// Reuse one client across hot reloads in development.
const globalForPrisma = globalThis

function createClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })
}

export const prisma = globalForPrisma.__prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.__prisma = prisma
