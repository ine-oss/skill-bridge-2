import { requireAuth } from '@/lib/auth'
import { handler, noContent, notFound, ok } from '@/lib/http'
import { prisma } from '@/lib/prisma'

export const POST = handler(async (request, { params }) => {
  const user = await requireAuth(request, ['jobseeker'])
  const job = await prisma.job.findUnique({ where: { id: params.id } })
  if (!job) throw notFound('Job not found')
  await prisma.savedJob.upsert({
    where: { userId_jobId: { userId: user.id, jobId: job.id } },
    update: {},
    create: { userId: user.id, jobId: job.id },
  })
  return ok({ saved: true })
})

export const DELETE = handler(async (request, { params }) => {
  const user = await requireAuth(request, ['jobseeker'])
  await prisma.savedJob.deleteMany({ where: { userId: user.id, jobId: params.id } })
  return noContent()
})
