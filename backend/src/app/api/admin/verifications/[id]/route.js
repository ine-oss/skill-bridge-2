import { audit, notify } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { badRequest, handler, notFound, ok, readJson } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { verificationReviewSchema } from '@/lib/validators'

export const PATCH = handler(async (request, { params }) => {
  const admin = await requireAuth(request, ['admin'])
  const { status, reviewerNote } = await readJson(request, verificationReviewSchema)
  const verification = await prisma.verificationRequest.findUnique({ where: { id: params.id }, include: { user: true } })
  if (!verification) throw notFound('Verification request not found')
  if (verification.status !== 'UNDER_REVIEW') throw badRequest('This request has already been reviewed')

  const approved = status === 'APPROVED'
  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.verificationRequest.update({
      where: { id: verification.id },
      data: { status, reviewerNote, reviewerId: admin.id, reviewedAt: new Date() },
    })
    await tx.user.update({ where: { id: verification.userId }, data: { verificationStatus: status } })
    if (verification.user.role === 'employer') await tx.company.updateMany({ where: { ownerId: verification.userId }, data: { verified: approved } })
    if (verification.user.role === 'training') await tx.trainingProvider.updateMany({ where: { ownerId: verification.userId }, data: { verified: approved } })
    return result
  })

  await audit(admin.id, 'admin.verification.review', { entity: 'VerificationRequest', entityId: verification.id, meta: { status } })
  await notify(verification.userId, {
    title: approved ? 'Verification approved' : 'Verification needs attention',
    description: approved ? 'Your account is now verified.' : reviewerNote || 'Your verification request was not approved. Please resubmit.',
    type: 'SYSTEM',
  })
  return ok({ request: updated })
})
