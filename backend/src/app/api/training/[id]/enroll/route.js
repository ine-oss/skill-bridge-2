import { audit, notify } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { badRequest, conflict, created, handler, notFound } from '@/lib/http'
import { prisma } from '@/lib/prisma'

export const POST = handler(async (request, { params }) => {
  const user = await requireAuth(request, ['jobseeker'])
  const program = await prisma.trainingProgram.findUnique({ where: { id: params.id }, include: { provider: true } })
  if (!program) throw notFound('Program not found')
  if (program.status !== 'ACTIVE') throw badRequest('This program is not open for enrollment')

  const existing = await prisma.enrollment.findUnique({ where: { programId_userId: { programId: program.id, userId: user.id } } })
  if (existing) throw conflict('You are already enrolled in this program')

  const enrollment = await prisma.enrollment.create({ data: { programId: program.id, userId: user.id } })
  await audit(user.id, 'enrollment.create', { entity: 'Enrollment', entityId: enrollment.id })
  await notify(program.provider.ownerId, {
    title: 'New learner',
    description: `${user.name} enrolled in ${program.title}`,
    type: 'TRAINING',
    link: '/training/learners',
  })
  return created({ enrollment })
})
