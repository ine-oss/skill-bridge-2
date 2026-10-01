import { requireAuth } from '@/lib/auth'
import { handler, ok } from '@/lib/http'
import { programInclude } from '@/lib/includes'
import { prisma } from '@/lib/prisma'
import { serializeProgram } from '@/lib/serializers'

export const GET = handler(async (request) => {
  const user = await requireAuth(request, ['training'])
  const programs = await prisma.trainingProgram.findMany({
    where: { provider: { ownerId: user.id } },
    include: { ...programInclude, enrollments: { select: { progress: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return ok({
    data: programs.map(({ enrollments, ...program }) => ({
      ...serializeProgram(program),
      completion: enrollments.length ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length) : 0,
    })),
  })
})
