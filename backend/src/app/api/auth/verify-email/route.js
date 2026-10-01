import { consumeOneTimeToken, createOneTimeToken, requireAuth } from '@/lib/auth'
import { badRequest, handler, ok, readJson } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { verifyEmailSchema } from '@/lib/validators'
import { frontendUrl, isEmailConfigured, verificationEmail } from '@/lib/mailer'

// GET: request a new verification link for the signed-in user.
export const GET = handler(async (request) => {
  const user = await requireAuth(request)
  if (user.emailVerified) return ok({ message: 'Email already verified' })
  const token = await createOneTimeToken(user.id, 'EMAIL_VERIFICATION', 60 * 24)
  const verifyUrl = `${frontendUrl()}/verify-email?token=${token}`
  await verificationEmail(user.email, user.name, verifyUrl)
  const response = { message: 'Verification link sent' }
  if (!isEmailConfigured() && process.env.NODE_ENV !== 'production') response.devVerifyUrl = verifyUrl
  return ok(response)
})

// POST: confirm with the token from the link.
export const POST = handler(async (request) => {
  const { token } = await readJson(request, verifyEmailSchema)
  const record = await consumeOneTimeToken(token, 'EMAIL_VERIFICATION')
  if (!record) throw badRequest('This verification link is invalid or has expired')
  await prisma.user.update({ where: { id: record.userId }, data: { emailVerified: true } })
  return ok({ message: 'Email verified' })
})
