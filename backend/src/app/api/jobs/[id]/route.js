import { audit } from '@/lib/audit'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { forbidden, handler, noContent, notFound, ok, readJson } from '@/lib/http'
import { jobInclude } from '@/lib/includes'
import { computeMatch, getUserSkillList } from '@/lib/matching'
import { prisma } from '@/lib/prisma'
import { serializeJob } from '@/lib/serializers'
import { upsertSkills } from '@/lib/utils'
import { updateJobSchema } from '@/lib/validators'

const canManage = (user, job) => user && (user.role === 'admin' || job.company.ownerId === user.id)

export const GET = handler(async (request, { params }) => {
  const viewer = await getAuthUser(request)
  const job = await prisma.job.findUnique({ where: { id: params.id }, include: jobInclude })
  if (!job || (job.status !== 'ACTIVE' && !canManage(viewer, job))) throw notFound('Job not found')

  const result = serializeJob(job)
  if (viewer?.role === 'jobseeker') {
    const [userSkills, saved, application] = await Promise.all([
      getUserSkillList(viewer.id),
      prisma.savedJob.findUnique({ where: { userId_jobId: { userId: viewer.id, jobId: job.id } } }),
      prisma.application.findUnique({ where: { jobId_applicantId: { jobId: job.id, applicantId: viewer.id } } }),
    ])
    const { match, missing } = computeMatch(userSkills, result.skills)
    Object.assign(result, { match, missingSkills: missing, saved: Boolean(saved), applicationStatus: application?.status || null })
  }
  return ok({ job: result })
})

export const PATCH = handler(async (request, { params }) => {
  const user = await requireAuth(request, ['employer', 'admin'])
  const job = await prisma.job.findUnique({ where: { id: params.id }, include: { company: true } })
  if (!job) throw notFound('Job not found')
  if (!canManage(user, job)) throw forbidden()

  const { skills, ...data } = await readJson(request, updateJobSchema)
  if (data.status === 'ACTIVE' && !job.publishedAt) data.publishedAt = new Date()

  const updated = await prisma.$transaction(async (tx) => {
    if (skills) {
      const skillIds = await upsertSkills(skills)
      await tx.jobSkill.deleteMany({ where: { jobId: job.id } })
      await tx.jobSkill.createMany({ data: skillIds.map((skillId) => ({ jobId: job.id, skillId })) })
    }
    return tx.job.update({ where: { id: job.id }, data, include: jobInclude })
  })
  await audit(user.id, 'job.update', { entity: 'Job', entityId: job.id, meta: { fields: Object.keys(data) } })
  return ok({ job: serializeJob(updated) })
})

export const DELETE = handler(async (request, { params }) => {
  const user = await requireAuth(request, ['employer', 'admin'])
  const job = await prisma.job.findUnique({ where: { id: params.id }, include: { company: true } })
  if (!job) throw notFound('Job not found')
  if (!canManage(user, job)) throw forbidden()
  await prisma.job.delete({ where: { id: job.id } })
  await audit(user.id, 'job.delete', { entity: 'Job', entityId: job.id })
  return noContent()
})
