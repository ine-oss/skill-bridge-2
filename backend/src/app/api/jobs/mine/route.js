import { requireAuth } from '@/lib/auth'
import { handler, ok } from '@/lib/http'
import { jobInclude } from '@/lib/includes'
import { prisma } from '@/lib/prisma'
import { serializeJob } from '@/lib/serializers'

// The signed-in employer's jobs, all statuses. Optional ?status=ACTIVE|DRAFT|PAUSED|CLOSED
export const GET = handler(async (request) => {
  const user = await requireAuth(request, ['employer'])
  const status = new URL(request.url).searchParams.get('status')
  const jobs = await prisma.job.findMany({
    where: { company: { ownerId: user.id }, ...(status ? { status } : {}) },
    include: jobInclude,
    orderBy: { createdAt: 'desc' },
  })
  return ok({ data: jobs.map(serializeJob) })
})
