import { requireAuth } from '@/lib/auth'
import { handler, ok } from '@/lib/http'
import { prisma } from '@/lib/prisma'

export const POST = handler(async (request) => {
  const user = await requireAuth(request)
  const { count } = await prisma.notification.updateMany({ where: { userId: user.id, read: false }, data: { read: true } })
  return ok({ updated: count })
})
