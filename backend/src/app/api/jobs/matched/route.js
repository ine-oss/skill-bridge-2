import { requireAuth } from '@/lib/auth'
import { handler, ok } from '@/lib/http'
import { jobInclude } from '@/lib/includes'
import { computeMatch, getUserSkillList } from '@/lib/matching'
import { prisma } from '@/lib/prisma'
import { serializeJob } from '@/lib/serializers'

// Active jobs ranked by skill match for the signed-in job seeker. ?min=50 filters weak matches.
export const GET = handler(async (request) => {
  const user = await requireAuth(request, ['jobseeker'])
  const min = Number(new URL(request.url).searchParams.get('min') || 0)
  const [jobs, userSkills] = await Promise.all([
    prisma.job.findMany({ where: { status: 'ACTIVE' }, include: jobInclude, take: 200, orderBy: { createdAt: 'desc' } }),
    getUserSkillList(user.id),
  ])
  const ranked = jobs
    .map((job) => {
      const serialized = serializeJob(job)
      const { match, missing } = computeMatch(userSkills, serialized.skills)
      return { ...serialized, match, missingSkills: missing }
    })
    .filter((job) => job.match >= min)
    .sort((a, b) => b.match - a.match)
  return ok({ data: ranked })
})
