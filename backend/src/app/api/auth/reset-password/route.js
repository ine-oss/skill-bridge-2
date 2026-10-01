import { audit } from '@/lib/audit'
import { consumeOneTimeToken, hashPassword } from '@/lib/auth'
import { badRequest, handler, ok, readJson } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { resetPasswordSchema } from '@/lib/validators'

export const POST = handler(async (request) => {
  const { token, password } = await readJson(request, resetPasswordSchema)
  const record = await consumeOneTimeToken(token, 'PASSWORD_RESET')
  if (!record) throw badRequest('This reset link is invalid or has expired')

  await prisma.user.update({ where: { id: record.userId }, data: { passwordHash: await hashPassword(password) } })
  await audit(record.userId, 'user.password_reset', { entity: 'User', entityId: record.userId })
  return ok({ message: 'Password updated. You can now sign in.' })
})
