import { audit } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { conflict, created, handler, ok, readJson } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { serializeUser } from '@/lib/serializers'
import { verificationSubmitSchema } from '@/lib/validators'

// The signed-in user's latest verification request.
export const GET = handler(async (request) => {
  const user = await requireAuth(request)
  const latest = await prisma.verificationRequest.findFirst({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } })
  return ok({ verificationStatus: user.verificationStatus, request: latest })
})

/**
 * Submit proof for review (job seeker identity/education, employer business registration,
 * provider accreditation). `profileVerified` is set to true on submission, matching how the
 * frontend uses it as "onboarding complete"; admins approve or reject via /api/admin/verifications.
 */
export const POST = handler(async (request) => {
  const user = await requireAuth(request, ['jobseeker', 'employer', 'training'])
  if (user.verificationStatus === 'UNDER_REVIEW') throw conflict('A verification request is already under review')
  const { details } = await readJson(request, verificationSubmitSchema)

  const [verification, updatedUser] = await prisma.$transaction([
    prisma.verificationRequest.create({ data: { userId: user.id, details } }),
    prisma.user.update({ where: { id: user.id }, data: { verificationStatus: 'UNDER_REVIEW', profileVerified: true } }),
  ])
  await audit(user.id, 'verification.submit', { entity: 'VerificationRequest', entityId: verification.id })
  return created({ request: verification, user: serializeUser(updatedUser) })
})
