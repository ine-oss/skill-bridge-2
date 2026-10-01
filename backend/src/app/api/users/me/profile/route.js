import { requireAuth } from '@/lib/auth'
import { handler, ok, readJson } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { jobSeekerProfileSchema } from '@/lib/validators'

const FIELDS = ['headline', 'location', 'bio', 'targetCareer', 'education', 'experience', 'languages', 'certifications', 'portfolioUrl']

function completion(profile, skillCount) {
  const filled = FIELDS.filter((field) => {
    const value = profile[field]
    return Array.isArray(value) ? value.length > 0 : Boolean(value)
  }).length
  return Math.round(((filled + (skillCount > 0 ? 1 : 0)) / (FIELDS.length + 1)) * 100)
}

const include = { skills: { include: { skill: true } }, evidence: true }

export const GET = handler(async (request) => {
  const user = await requireAuth(request, ['jobseeker'])
  const profile = await prisma.jobSeekerProfile.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id }, include })
  return ok({ profile })
})

export const PUT = handler(async (request) => {
  const user = await requireAuth(request, ['jobseeker'])
  const data = await readJson(request, jobSeekerProfileSchema)
  const profile = await prisma.jobSeekerProfile.upsert({ where: { userId: user.id }, update: data, create: { ...data, userId: user.id }, include })
  const updated = await prisma.jobSeekerProfile.update({
    where: { id: profile.id },
    data: { profileCompletion: completion(profile, profile.skills.length) },
    include,
  })
  return ok({ profile: updated })
})
