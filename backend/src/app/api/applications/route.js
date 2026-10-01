import { audit, notify } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { badRequest, conflict, created, getPagination, handler, notFound, ok, paginated, readJson } from '@/lib/http'
import { applicationInclude } from '@/lib/includes'
import { computeMatch, getUserSkillList } from '@/lib/matching'
import { prisma } from '@/lib/prisma'
import { serializeApplication } from '@/lib/serializers'
import { createApplicationSchema } from '@/lib/validators'

/**
 * Role-aware list:
 *  - jobseeker: their own applications
 *  - employer: applications to their company's jobs
 *  - admin: everything
 * Query: status, jobId, page, limit.
 */
export const GET = handler(async (request) => {
  const user = await requireAuth(request, ['jobseeker', 'employer', 'admin'])
  const params = new URL(request.url).searchParams
  const pagination = getPagination(params)

  const where = {}
  if (user.role === 'jobseeker') where.applicantId = user.id
  if (user.role === 'employer') where.job = { company: { ownerId: user.id } }
  if (params.get('status')) where.status = params.get('status')
  if (params.get('jobId')) where.jobId = params.get('jobId')

  const [applications, total] = await Promise.all([
    prisma.application.findMany({ where, include: applicationInclude, orderBy: { createdAt: 'desc' }, skip: pagination.skip, take: pagination.take }),
    prisma.application.count({ where }),
  ])
  return ok(paginated(applications.map(serializeApplication), total, pagination))
})

// Job seekers apply to an active job.
export const POST = handler(async (request) => {
  const user = await requireAuth(request, ['jobseeker'])
  const { jobId, coverLetter, resumeUrl } = await readJson(request, createApplicationSchema)

  const job = await prisma.job.findUnique({ where: { id: jobId }, include: { company: true, skills: { include: { skill: true } } } })
  if (!job) throw notFound('Job not found')
  if (job.status !== 'ACTIVE') throw badRequest('This job is not accepting applications')
  if (job.deadline && job.deadline < new Date()) throw badRequest('The application deadline has passed')

  const existing = await prisma.application.findUnique({ where: { jobId_applicantId: { jobId, applicantId: user.id } } })
  if (existing) throw conflict('You have already applied to this job')

  const { match } = computeMatch(await getUserSkillList(user.id), job.skills.map((link) => link.skill.name))
  const profile = await prisma.jobSeekerProfile.findUnique({ where: { userId: user.id }, select: { cvUrl: true } })
  const application = await prisma.application.create({
    data: {
      jobId,
      applicantId: user.id,
      coverLetter,
      resumeUrl: resumeUrl || profile?.cvUrl || null,
      match,
      events: { create: { status: 'NEW', note: 'Application submitted' } },
    },
    include: applicationInclude,
  })

  await Promise.all([
    audit(user.id, 'application.create', { entity: 'Application', entityId: application.id }),
    notify(job.company.ownerId, {
      title: 'New applicant',
      description: `${user.name} applied for ${job.title} (${match}% match)`,
      type: 'APPLICATION',
      link: '/employer/applicants',
    }),
  ])
  return created({ application: serializeApplication(application) })
})
