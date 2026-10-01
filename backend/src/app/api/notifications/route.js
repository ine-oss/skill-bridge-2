import { requireAuth } from '@/lib/auth'
import { handler, ok } from '@/lib/http'
import { prisma } from '@/lib/prisma'

// Query: unread=true
export const GET = handler(async (request) => {
  const user = await requireAuth(request)
  const unreadOnly = new URL(request.url).searchParams.get('unread') === 'true'
  const [data, unread] = await Promise.all([
    prisma.notification.findMany({ where: { userId: user.id, ...(unreadOnly ? { read: false } : {}) }, orderBy: { createdAt: 'desc' }, take: 100 }),
    prisma.notification.count({ where: { userId: user.id, read: false } }),
  ])
  return ok({ data, unread })
})
