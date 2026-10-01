import { audit, notify } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { forbidden, created, handler, notFound, ok, readJson } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { initials } from '@/lib/utils'
import { createInterviewSchema } from '@/lib/validators'

const include = {
  application: { include: { applicant: true, job: { include: { company: true } } } },
}

function serialize(interview) {
  const { application, ...rest } = interview
  return {
    ...rest,
    applicationId: application.id,
    candidate: { id: application.applicant.id, name: application.applicant.name, initials: initials(application.applicant.name) },
    job: { id: application.job.id, title: application.job.title },
    company: { id: application.job.company.id, name: application.job.company.name },
  }
}

// Role-aware list. Query: upcoming=true, status.
export const GET = handler(async (request) => {
  const user = await requireAuth(request, ['jobseeker', 'employer', 'admin'])
  const params = new URL(request.url).searchParams
  const where = {}
  if (user.role === 'jobseeker') where.application = { applicantId: user.id }
  if (user.role === 'employer') where.application = { job: { company: { ownerId: user.id } } }
  if (params.get('status')) where.status = params.get('status')
  if (params.get('upcoming') === 'true') where.scheduledAt = { gte: new Date() }

  const interviews = await prisma.interview.findMany({ where, include, orderBy: { scheduledAt: 'asc' } })
  return ok({ data: interviews.map(serialize) })
})

// Employers schedule an interview for an application to one of their jobs.
export const POST = handler(async (request) => {
  const user = await requireAuth(request, ['employer'])
  const data = await readJson(request, createInterviewSchema)
  const application = await prisma.application.findUnique({ where: { id: data.applicationId }, include: { job: { include: { company: true } } } })
  if (!application) throw notFound('Application not found')
  if (application.job.company.ownerId !== user.id) throw forbidden()

  const [interview] = await prisma.$transaction([
    prisma.interview.create({ data, include }),
    prisma.application.update({
      where: { id: application.id },
      data: { status: 'INTERVIEW', events: { create: { status: 'INTERVIEW', note: `${data.type} scheduled` } } },
    }),
  ])

  await audit(user.id, 'interview.create', { entity: 'Interview', entityId: interview.id })
  await notify(application.applicantId, {
    title: 'Interview scheduled',
    description: `${application.job.company.name} invited you to a ${data.type} for ${application.job.title}`,
    type: 'INTERVIEW',
    link: '/jobseeker/interviews',
  })
  return created({ interview: serialize(interview) })
})
