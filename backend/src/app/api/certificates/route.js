import { requireAuth } from '@/lib/auth'
import { handler, ok } from '@/lib/http'
import { prisma } from '@/lib/prisma'

// Job seekers: their certificates. Providers: certificates they issued. Admin: all.
export const GET = handler(async (request) => {
  const user = await requireAuth(request, ['jobseeker', 'training', 'admin'])
  const where = {}
  if (user.role === 'jobseeker') where.enrollment = { userId: user.id }
  if (user.role === 'training') where.enrollment = { program: { provider: { ownerId: user.id } } }

  const certificates = await prisma.certificate.findMany({
    where,
    include: { enrollment: { include: { user: true, program: { include: { provider: true } } } } },
    orderBy: { issuedAt: 'desc' },
  })
  return ok({
    data: certificates.map(({ enrollment, ...certificate }) => ({
      ...certificate,
      learner: { id: enrollment.user.id, name: enrollment.user.name },
      program: { id: enrollment.program.id, title: enrollment.program.title },
      provider: enrollment.program.provider.name,
    })),
  })
})
