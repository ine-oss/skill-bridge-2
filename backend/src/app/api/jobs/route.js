import { audit } from '@/lib/audit'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { created, forbidden, getPagination, handler, ok, paginated, readJson } from '@/lib/http'
import { jobInclude } from '@/lib/includes'
import { computeMatch, getUserSkillList } from '@/lib/matching'
import { prisma } from '@/lib/prisma'
import { serializeJob } from '@/lib/serializers'
import { upsertSkills } from '@/lib/utils'
import { createJobSchema } from '@/lib/validators'

/**
 * Public job search.
 * Query: q, mode (ONSITE|HYBRID|REMOTE), type (FULL_TIME…), industry, skill, company (id or slug), page, limit.
 * Admins may pass status=ALL (or a specific status) to see unpublished jobs.
 * Signed-in job seekers get a `match` score on each job.
 */
export const GET = handler(async (request) => {
  const params = new URL(request.url).searchParams
  const viewer = await getAuthUser(request)
  const pagination = getPagination(params)

  const statusParam = params.get('status')
  const where = { status: 'ACTIVE' }
  if (viewer?.role === 'admin' && statusParam) {
    if (statusParam === 'ALL') delete where.status
    else where.status = statusParam
  }

  const q = params.get('q')
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { company: { name: { contains: q, mode: 'insensitive' } } },
    ]
  }
  if (params.get('mode')) where.mode = params.get('mode')
  if (params.get('type')) where.employmentType = params.get('type')
  if (params.get('industry')) where.industry = { equals: params.get('industry'), mode: 'insensitive' }
  if (params.get('skill')) where.skills = { some: { skill: { name: { equals: params.get('skill'), mode: 'insensitive' } } } }
  if (params.get('company')) where.company = { OR: [{ id: params.get('company') }, { slug: params.get('company') }] }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({ where, include: jobInclude, orderBy: { createdAt: 'desc' }, skip: pagination.skip, take: pagination.take }),
    prisma.job.count({ where }),
  ])

  let items = jobs.map(serializeJob)
  if (viewer?.role === 'jobseeker') {
    const userSkills = await getUserSkillList(viewer.id)
    items = items.map((job) => ({ ...job, match: computeMatch(userSkills, job.skills).match }))
  }
  return ok(paginated(items, total, pagination))
})

// Employers post a job for their company.
export const POST = handler(async (request) => {
  const user = await requireAuth(request, ['employer'])
  const company = await prisma.company.findUnique({ where: { ownerId: user.id } })
  if (!company) throw forbidden('Create your company profile before posting jobs')

  const { skills = [], ...data } = await readJson(request, createJobSchema)
  const skillIds = await upsertSkills(skills)
  const status = data.status || 'DRAFT'

  const job = await prisma.job.create({
    data: {
      ...data,
      status,
      publishedAt: status === 'ACTIVE' ? new Date() : null,
      companyId: company.id,
      skills: { create: skillIds.map((skillId) => ({ skillId })) },
    },
    include: jobInclude,
  })
  await audit(user.id, 'job.create', { entity: 'Job', entityId: job.id })
  return created({ job: serializeJob(job) })
})
