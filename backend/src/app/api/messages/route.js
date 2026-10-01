import { notify } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { badRequest, created, handler, notFound, ok, readJson } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { initials } from '@/lib/utils'
import { sendMessageSchema } from '@/lib/validators'

// Conversation list: one entry per person you have exchanged messages with.
export const GET = handler(async (request) => {
  const user = await requireAuth(request)
  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: user.id }, { recipientId: user.id }] },
    include: { sender: true, recipient: true },
    orderBy: { createdAt: 'desc' },
    take: 500,
  })

  const conversations = new Map()
  for (const message of messages) {
    const other = message.senderId === user.id ? message.recipient : message.sender
    if (!conversations.has(other.id)) {
      conversations.set(other.id, {
        user: { id: other.id, name: other.name, role: other.role, initials: initials(other.name) },
        lastMessage: { body: message.body, createdAt: message.createdAt, fromMe: message.senderId === user.id },
        unread: 0,
      })
    }
    if (message.recipientId === user.id && !message.readAt) conversations.get(other.id).unread += 1
  }
  return ok({ data: [...conversations.values()] })
})

export const POST = handler(async (request) => {
  const user = await requireAuth(request)
  const { recipientId, body } = await readJson(request, sendMessageSchema)
  if (recipientId === user.id) throw badRequest('You cannot message yourself')
  const recipient = await prisma.user.findUnique({ where: { id: recipientId } })
  if (!recipient) throw notFound('Recipient not found')

  const message = await prisma.message.create({ data: { senderId: user.id, recipientId, body } })
  await notify(recipientId, { title: `New message from ${user.name}`, description: body.slice(0, 140), type: 'MESSAGE', link: `/${recipient.role}/messages` })
  return created({ message })
})
