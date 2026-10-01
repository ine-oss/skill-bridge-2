import { audit } from '@/lib/audit'
import { hashPassword, requireAuth, verifyPassword } from '@/lib/auth'
import { badRequest, handler, ok, readJson } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { changePasswordSchema } from '@/lib/validators'

export const POST = handler(async (request) => {
  const user = await requireAuth(request)
  const { currentPassword, newPassword } = await readJson(request, changePasswordSchema)
  if (!(await verifyPassword(currentPassword, user.passwordHash))) throw badRequest('Current password is incorrect')

  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(newPassword) } })
  await audit(user.id, 'user.password_changed', { entity: 'User', entityId: user.id })
  return ok({ message: 'Password changed' })
})
