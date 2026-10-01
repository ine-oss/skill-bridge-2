import { audit } from '@/lib/audit'
import { createOneTimeToken } from '@/lib/auth'
import { handler, ok, readJson } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { forgotPasswordSchema } from '@/lib/validators'
import { frontendUrl, isEmailConfigured, passwordResetEmail } from '@/lib/mailer'

export const POST = handler(async (request) => {
  const { email } = await readJson(request, forgotPasswordSchema)
  const user = await prisma.user.findUnique({ where: { email } })
  const response = { message: 'If an account exists for that email, a reset link has been sent.' }

  if (user) {
    const token = await createOneTimeToken(user.id, 'PASSWORD_RESET', 60)
    const resetUrl = `${frontendUrl()}/reset-password?token=${token}`
    await audit(user.id, 'user.password_reset_requested', { entity: 'User', entityId: user.id })
    await passwordResetEmail(user.email, resetUrl)
    // With no email service configured, hand the link back in development so the flow can be tested.
    if (!isEmailConfigured() && process.env.NODE_ENV !== 'production') response.devResetUrl = resetUrl
  }
  return ok(response)
})
