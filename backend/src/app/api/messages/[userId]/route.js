import { requireAuth } from '@/lib/auth'
import { handler, notFound, ok } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { initials } from '@/lib/utils'

// Full thread with one person; marks their messages to you as read.
export const GET = handler(async (request, { params }) => {
  const user = await requireAuth(request)
  const other = await prisma.user.findUnique({ where: { id: params.userId } })
  if (!other) throw notFound('User not found')

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: user.id, recipientId: other.id },
        { senderId: other.id, recipientId: user.id },
      ],
    },
    orderBy: { createdAt: 'asc' },
  })
  await prisma.message.updateMany({ where: { senderId: other.id, recipientId: user.id, readAt: null }, data: { readAt: new Date() } })

  return ok({
    user: { id: other.id, name: other.name, role: other.role, initials: initials(other.name) },
    messages: messages.map((message) => ({ ...message, fromMe: message.senderId === user.id })),
  })
})
