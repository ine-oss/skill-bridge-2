import { audit } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { handler, noContent } from '@/lib/http'
import { prisma } from '@/lib/prisma'

export const DELETE = handler(async (request, { params }) => {
  const admin = await requireAuth(request, ['admin'])
  await prisma.skill.delete({ where: { id: params.id } })
  await audit(admin.id, 'skill.delete', { entity: 'Skill', entityId: params.id })
  return noContent()
})
