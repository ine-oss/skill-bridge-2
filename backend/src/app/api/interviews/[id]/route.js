import { audit, notify } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { forbidden, handler, notFound, ok, readJson } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { updateInterviewSchema } from '@/lib/validators'

export const PATCH = handler(async (request, { params }) => {
  const user = await requireAuth(request, ['employer', 'admin'])
  const interview = await prisma.interview.findUnique({
    where: { id: params.id },
    include: { application: { include: { job: { include: { company: true } } } } },
  })
  if (!interview) throw notFound('Interview not found')
  if (user.role !== 'admin' && interview.application.job.company.ownerId !== user.id) throw forbidden()

  const data = await readJson(request, updateInterviewSchema)
  const updated = await prisma.interview.update({ where: { id: interview.id }, data })
  await audit(user.id, 'interview.update', { entity: 'Interview', entityId: interview.id })
  if (data.scheduledAt || data.status === 'CANCELLED') {
    await notify(interview.application.applicantId, {
      title: data.status === 'CANCELLED' ? 'Interview cancelled' : 'Interview rescheduled',
      description: `Your interview for ${interview.application.job.title} was ${data.status === 'CANCELLED' ? 'cancelled' : 'moved'}`,
      type: 'INTERVIEW',
      link: '/jobseeker/interviews',
    })
  }
  return ok({ interview: updated })
})
