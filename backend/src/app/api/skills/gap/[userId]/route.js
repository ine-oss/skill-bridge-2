import { requireAuth } from '@/lib/auth'
import { forbidden, handler, notFound, ok } from '@/lib/http'
import { computeMatch, getUserSkillList } from '@/lib/matching'
import { prisma } from '@/lib/prisma'
import { programInclude } from '@/lib/includes'
import { serializeProgram } from '@/lib/serializers'

/**
 * Skill gap for a job seeker. `userId` may be "me".
 * Target: ?jobId=… (a specific job), otherwise the profile's targetCareer
 * (skills demanded by active jobs with a matching title), otherwise the most in-demand skills.
 */
export const GET = handler(async (request, { params }) => {
  const viewer = await requireAuth(request)
  const userId = params.userId === 'me' ? viewer.id : params.userId
  if (userId !== viewer.id && !['admin', 'employer', 'training'].includes(viewer.role)) throw forbidden()

  const profile = await prisma.jobSeekerProfile.findUnique({ where: { userId } })
  if (!profile) throw notFound('Job seeker profile not found')

  const jobId = new URL(request.url).searchParams.get('jobId')
  let targetCareer = profile.targetCareer
  let requiredSkills = []

  if (jobId) {
    const job = await prisma.job.findUnique({ where: { id: jobId }, include: { skills: { include: { skill: true } } } })
    if (!job) throw notFound('Job not found')
    targetCareer = job.title
    requiredSkills = job.skills.map((link) => link.skill.name)
  } else {
    const jobs = await prisma.job.findMany({
      where: { status: 'ACTIVE', ...(targetCareer ? { title: { contains: targetCareer, mode: 'insensitive' } } : {}) },
      include: { skills: { include: { skill: true } } },
      take: 50,
    })
    const counts = new Map()
    for (const job of jobs) for (const link of job.skills) counts.set(link.skill.name, (counts.get(link.skill.name) || 0) + 1)
    requiredSkills = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name]) => name)
  }

  const userSkills = await getUserSkillList(userId)
  const { match, missing } = computeMatch(userSkills, requiredSkills)

  const programs = missing.length
    ? await prisma.trainingProgram.findMany({
        where: { status: 'ACTIVE', skills: { some: { skill: { name: { in: missing } } } } },
        include: programInclude,
        take: 6,
      })
    : []

  return ok({
    targetCareer,
    match,
    currentSkills: userSkills.map((skill) => skill.name),
    requiredSkills,
    missingSkills: missing,
    skillStrength: userSkills.map((skill) => ({ skill: skill.name, value: skill.score })),
    recommendedLearning: missing.map((skill) => `Build your ${skill} skills`),
    recommendedTraining: programs.map(serializeProgram),
  })
})
