import { audit } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { handler, notFound, ok, readJson } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { companySchema } from '@/lib/validators'

export const GET = handler(async (request) => {
  const user = await requireAuth(request, ['employer'])
  const company = await prisma.company.findUnique({ where: { ownerId: user.id } })
  if (!company) throw notFound('Company profile not found')
  return ok({ company })
})

export const PUT = handler(async (request) => {
  const user = await requireAuth(request, ['employer'])
  const data = await readJson(request, companySchema)
  const company = await prisma.company.update({ where: { ownerId: user.id }, data })
  await audit(user.id, 'company.update', { entity: 'Company', entityId: company.id })
  return ok({ company })
})
