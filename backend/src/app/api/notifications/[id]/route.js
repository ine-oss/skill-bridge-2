import { requireAuth } from '@/lib/auth'
import { handler, noContent, notFound, ok, readJson } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

async function own(userId, id) {
  const notification = await prisma.notification.findUnique({ where: { id } })
  if (!notification || notification.userId !== userId) throw notFound('Notification not found')
  return notification
}

export const PATCH = handler(async (request, { params }) => {
  const user = await requireAuth(request)
  await own(user.id, params.id)
  const { read } = await readJson(request, z.object({ read: z.boolean().default(true) }))
  return ok({ notification: await prisma.notification.update({ where: { id: params.id }, data: { read } }) })
})

export const DELETE = handler(async (request, { params }) => {
  const user = await requireAuth(request)
  await own(user.id, params.id)
  await prisma.notification.delete({ where: { id: params.id } })
  return noContent()
})
