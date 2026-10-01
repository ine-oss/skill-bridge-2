import { requireAuth } from '@/lib/auth'
import { handler, ok } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { initials } from '@/lib/utils'

/**
 * Job seekers: their own enrollments.
 * Training providers: learners across their programs (?programId= to filter).
 * Admin: all.
 */
export const GET = handler(async (request) => {
  const user = await requireAuth(request, ['jobseeker', 'training', 'admin'])
  const programId = new URL(request.url).searchParams.get('programId')
  const where = {}
  if (user.role === 'jobseeker') where.userId = user.id
  if (user.role === 'training') where.program = { provider: { ownerId: user.id } }
  if (programId) where.programId = programId

  const enrollments = await prisma.enrollment.findMany({
    where,
    include: { program: { include: { provider: true } }, user: true, certificate: true },
    orderBy: { enrolledAt: 'desc' },
  })
  return ok({
    data: enrollments.map(({ user: learner, program, ...enrollment }) => ({
      ...enrollment,
      learner: { id: learner.id, name: learner.name, email: learner.email, initials: initials(learner.name) },
      program: { id: program.id, title: program.title, provider: program.provider.name, certificate: program.certificate },
    })),
  })
})
