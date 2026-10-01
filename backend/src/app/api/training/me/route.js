import { requireAuth } from '@/lib/auth'
import { handler, notFound, ok, readJson } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { providerSchema } from '@/lib/validators'

// The signed-in training provider's organisation profile.
export const GET = handler(async (request) => {
  const user = await requireAuth(request, ['training'])
  const provider = await prisma.trainingProvider.findUnique({ where: { ownerId: user.id } })
  if (!provider) throw notFound('Provider profile not found')
  return ok({ provider })
})

export const PUT = handler(async (request) => {
  const user = await requireAuth(request, ['training'])
  const data = await readJson(request, providerSchema)
  return ok({ provider: await prisma.trainingProvider.update({ where: { ownerId: user.id }, data }) })
})
