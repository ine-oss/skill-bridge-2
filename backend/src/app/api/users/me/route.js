import { requireAuth } from '@/lib/auth'
import { handler, ok, readJson } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { serializeUser } from '@/lib/serializers'
import { updateUserSchema } from '@/lib/validators'

const include = { jobSeekerProfile: { include: { skills: { include: { skill: true } } } }, company: true, trainingProvider: true }

export const GET = handler(async (request) => {
  const user = await requireAuth(request)
  return ok({ user: serializeUser(await prisma.user.findUnique({ where: { id: user.id }, include })) })
})

export const PUT = handler(async (request) => {
  const user = await requireAuth(request)
  const data = await readJson(request, updateUserSchema)
  const updated = await prisma.user.update({ where: { id: user.id }, data, include })
  return ok({ user: serializeUser(updated) })
})
