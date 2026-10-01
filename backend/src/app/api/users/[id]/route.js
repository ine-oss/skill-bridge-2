import { requireAuth } from '@/lib/auth'
import { forbidden, handler, notFound, ok, readJson } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { serializeUser } from '@/lib/serializers'
import { updateUserSchema } from '@/lib/validators'

// Any signed-in user can view a public profile (e.g. an employer reviewing an applicant).
export const GET = handler(async (request, { params }) => {
  const viewer = await requireAuth(request)
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      jobSeekerProfile: { include: { skills: { include: { skill: true } }, evidence: true } },
      company: true,
      trainingProvider: true,
    },
  })
  if (!user) throw notFound('User not found')
  const serialized = serializeUser(user)
  if (viewer.id !== user.id && viewer.role !== 'admin') {
    delete serialized.phone
    delete serialized.lastLoginAt
  }
  return ok({ user: serialized })
})

export const PUT = handler(async (request, { params }) => {
  const viewer = await requireAuth(request)
  if (viewer.id !== params.id && viewer.role !== 'admin') throw forbidden()
  const data = await readJson(request, updateUserSchema)
  const updated = await prisma.user.update({ where: { id: params.id }, data })
  return ok({ user: serializeUser(updated) })
})
