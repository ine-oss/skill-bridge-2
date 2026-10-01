import { audit } from '@/lib/audit'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { created, forbidden, getPagination, handler, ok, paginated, readJson } from '@/lib/http'
import { programInclude } from '@/lib/includes'
import { prisma } from '@/lib/prisma'
import { serializeProgram } from '@/lib/serializers'
import { upsertSkills } from '@/lib/utils'
import { createProgramSchema } from '@/lib/validators'

// Public catalogue of active programs. Query: q, mode, difficulty, skill, provider, page, limit.
// Admins may pass status=ALL (or DRAFT/ARCHIVED) to see unpublished programs.
export const GET = handler(async (request) => {
  const params = new URL(request.url).searchParams
  const pagination = getPagination(params)
  const where = { status: 'ACTIVE' }
  const statusParam = params.get('status')
  if (statusParam && (await getAuthUser(request))?.role === 'admin') {
    if (statusParam === 'ALL') delete where.status
    else where.status = statusParam
  }
  if (params.get('q')) {
    where.OR = [
      { title: { contains: params.get('q'), mode: 'insensitive' } },
      { description: { contains: params.get('q'), mode: 'insensitive' } },
    ]
  }
  if (params.get('mode')) where.mode = params.get('mode')
  if (params.get('difficulty')) where.difficulty = params.get('difficulty')
  if (params.get('skill')) where.skills = { some: { skill: { name: { equals: params.get('skill'), mode: 'insensitive' } } } }
  if (params.get('provider')) where.provider = { OR: [{ id: params.get('provider') }, { slug: params.get('provider') }] }

  const [programs, total] = await Promise.all([
    prisma.trainingProgram.findMany({ where, include: programInclude, orderBy: { createdAt: 'desc' }, skip: pagination.skip, take: pagination.take }),
    prisma.trainingProgram.count({ where }),
  ])
  return ok(paginated(programs.map(serializeProgram), total, pagination))
})

// Training providers create programs.
export const POST = handler(async (request) => {
  const user = await requireAuth(request, ['training'])
  const provider = await prisma.trainingProvider.findUnique({ where: { ownerId: user.id } })
  if (!provider) throw forbidden('Create your provider profile first')

  const { skills = [], ...data } = await readJson(request, createProgramSchema)
  const skillIds = await upsertSkills(skills)
  const program = await prisma.trainingProgram.create({
    data: { ...data, providerId: provider.id, skills: { create: skillIds.map((skillId) => ({ skillId })) } },
    include: programInclude,
  })
  await audit(user.id, 'program.create', { entity: 'TrainingProgram', entityId: program.id })
  return created({ program: serializeProgram(program) })
})
