import { audit } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { badRequest, handler, noContent, ok, readJson } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { serializeUser } from '@/lib/serializers'
import { adminUpdateUserSchema } from '@/lib/validators'

export const PATCH = handler(async (request, { params }) => {
  const admin = await requireAuth(request, ['admin'])
  const data = await readJson(request, adminUpdateUserSchema)
  if (params.id === admin.id && (data.role || data.status === 'SUSPENDED')) throw badRequest('You cannot change your own role or suspend yourself')
  const user = await prisma.user.update({ where: { id: params.id }, data })
  await audit(admin.id, 'admin.user.update', { entity: 'User', entityId: user.id, meta: data })
  return ok({ user: serializeUser(user) })
})

export const DELETE = handler(async (request, { params }) => {
  const admin = await requireAuth(request, ['admin'])
  if (params.id === admin.id) throw badRequest('You cannot delete your own account')
  await prisma.user.delete({ where: { id: params.id } })
  await audit(admin.id, 'admin.user.delete', { entity: 'User', entityId: params.id })
  return noContent()
})
