import { requireAuth } from '@/lib/auth'
import { handler, ok } from '@/lib/http'
import { jobInclude } from '@/lib/includes'
import { prisma } from '@/lib/prisma'
import { serializeJob } from '@/lib/serializers'

export const GET = handler(async (request) => {
  const user = await requireAuth(request, ['jobseeker'])
  const saved = await prisma.savedJob.findMany({
    where: { userId: user.id },
    include: { job: { include: jobInclude } },
    orderBy: { createdAt: 'desc' },
  })
  return ok({ data: saved.map((item) => ({ ...serializeJob(item.job), savedAt: item.createdAt })) })
})
