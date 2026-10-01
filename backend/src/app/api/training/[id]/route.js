import { audit } from '@/lib/audit'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { forbidden, handler, noContent, notFound, ok, readJson } from '@/lib/http'
import { programInclude } from '@/lib/includes'
import { prisma } from '@/lib/prisma'
import { serializeProgram } from '@/lib/serializers'
import { upsertSkills } from '@/lib/utils'
import { updateProgramSchema } from '@/lib/validators'

const canManage = (user, program) => user && (user.role === 'admin' || program.provider.ownerId === user.id)

export const GET = handler(async (request, { params }) => {
  const viewer = await getAuthUser(request)
  const program = await prisma.trainingProgram.findUnique({ where: { id: params.id }, include: programInclude })
  if (!program || (program.status !== 'ACTIVE' && !canManage(viewer, program))) throw notFound('Program not found')

  const result = serializeProgram(program)
  if (viewer?.role === 'jobseeker') {
    const enrollment = await prisma.enrollment.findUnique({ where: { programId_userId: { programId: program.id, userId: viewer.id } } })
    result.enrollment = enrollment
  }
  return ok({ program: result })
})

export const PATCH = handler(async (request, { params }) => {
  const user = await requireAuth(request, ['training', 'admin'])
  const program = await prisma.trainingProgram.findUnique({ where: { id: params.id }, include: { provider: true } })
  if (!program) throw notFound('Program not found')
  if (!canManage(user, program)) throw forbidden()

  const { skills, ...data } = await readJson(request, updateProgramSchema)
  const updated = await prisma.$transaction(async (tx) => {
    if (skills) {
      const skillIds = await upsertSkills(skills)
      await tx.programSkill.deleteMany({ where: { programId: program.id } })
      await tx.programSkill.createMany({ data: skillIds.map((skillId) => ({ programId: program.id, skillId })) })
    }
    return tx.trainingProgram.update({ where: { id: program.id }, data, include: programInclude })
  })
  await audit(user.id, 'program.update', { entity: 'TrainingProgram', entityId: program.id })
  return ok({ program: serializeProgram(updated) })
})

export const DELETE = handler(async (request, { params }) => {
  const user = await requireAuth(request, ['training', 'admin'])
  const program = await prisma.trainingProgram.findUnique({ where: { id: params.id }, include: { provider: true } })
  if (!program) throw notFound('Program not found')
  if (!canManage(user, program)) throw forbidden()
  await prisma.trainingProgram.delete({ where: { id: program.id } })
  await audit(user.id, 'program.delete', { entity: 'TrainingProgram', entityId: program.id })
  return noContent()
})
