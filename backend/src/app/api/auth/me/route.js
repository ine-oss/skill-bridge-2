import { requireAuth } from '@/lib/auth'
import { handler, ok } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { serializeUser } from '@/lib/serializers'

export const GET = handler(async (request) => {
  const authUser = await requireAuth(request)
  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: { jobSeekerProfile: true, company: true, trainingProvider: true },
  })
  return ok({ user: serializeUser(user) })
})
