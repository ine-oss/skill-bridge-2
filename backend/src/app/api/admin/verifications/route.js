import { requireAuth } from '@/lib/auth'
import { handler, ok } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { serializeUser } from '@/lib/serializers'

// Query: status (default UNDER_REVIEW), or status=ALL
export const GET = handler(async (request) => {
  await requireAuth(request, ['admin'])
  const status = new URL(request.url).searchParams.get('status') || 'UNDER_REVIEW'
  const requests = await prisma.verificationRequest.findMany({
    where: status === 'ALL' ? {} : { status },
    include: { user: { include: { company: true, trainingProvider: true } } },
    orderBy: { createdAt: 'asc' },
  })
  return ok({ data: requests.map((item) => ({ ...item, user: serializeUser(item.user) })) })
})
