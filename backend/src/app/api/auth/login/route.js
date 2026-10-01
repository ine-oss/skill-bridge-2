import { audit } from '@/lib/audit'
import { signAccessToken, verifyPassword } from '@/lib/auth'
import { ApiError, handler, ok, readJson } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { serializeUser } from '@/lib/serializers'
import { loginSchema } from '@/lib/validators'

export const POST = handler(async (request) => {
  const { email, password } = await readJson(request, loginSchema)
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw new ApiError(401, 'Invalid email or password')
  }
  if (user.status === 'SUSPENDED') throw new ApiError(403, 'This account has been suspended. Contact support.')

  const updated = await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
  const token = await signAccessToken(updated)
  await audit(user.id, 'user.login', { entity: 'User', entityId: user.id })

  return ok({ user: serializeUser(updated), token })
})
