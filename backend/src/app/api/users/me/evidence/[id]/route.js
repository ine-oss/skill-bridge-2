import { requireAuth } from '@/lib/auth'
import { handler, noContent, notFound } from '@/lib/http'
import { prisma } from '@/lib/prisma'

export const DELETE = handler(async (request, { params }) => {
  const user = await requireAuth(request, ['jobseeker'])
  const evidence = await prisma.evidence.findUnique({ where: { id: params.id }, include: { profile: true } })
  if (!evidence || evidence.profile.userId !== user.id) throw notFound()
  await prisma.evidence.delete({ where: { id: evidence.id } })
  return noContent()
})
