import { requireAuth } from '@/lib/auth'
import { created, handler, notFound, ok, readJson } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { evidenceSchema } from '@/lib/validators'

async function profileFor(userId) {
  const profile = await prisma.jobSeekerProfile.findUnique({ where: { userId } })
  if (!profile) throw notFound('Profile not found')
  return profile
}

export const GET = handler(async (request) => {
  const user = await requireAuth(request, ['jobseeker'])
  const profile = await profileFor(user.id)
  return ok({ data: await prisma.evidence.findMany({ where: { profileId: profile.id }, orderBy: { createdAt: 'desc' } }) })
})

export const POST = handler(async (request) => {
  const user = await requireAuth(request, ['jobseeker'])
  const profile = await profileFor(user.id)
  const data = await readJson(request, evidenceSchema)
  return created({ evidence: await prisma.evidence.create({ data: { ...data, profileId: profile.id } }) })
})
