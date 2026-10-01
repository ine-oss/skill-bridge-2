import { handler, notFound, ok } from '@/lib/http'
import { prisma } from '@/lib/prisma'

// Public: anyone (e.g. an employer) can check a certificate code.
export const GET = handler(async (request, { params }) => {
  const certificate = await prisma.certificate.findUnique({
    where: { code: params.code.toUpperCase() },
    include: { enrollment: { include: { user: true, program: { include: { provider: true } } } } },
  })
  if (!certificate) throw notFound('Certificate not found')
  return ok({
    valid: true,
    code: certificate.code,
    issuedAt: certificate.issuedAt,
    learner: certificate.enrollment.user.name,
    program: certificate.enrollment.program.title,
    provider: certificate.enrollment.program.provider.name,
  })
})
