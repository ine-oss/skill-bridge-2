import { requireAuth } from '@/lib/auth'
import { handler, ok, readJson } from '@/lib/http'
import { getUserSkillList } from '@/lib/matching'
import { prisma } from '@/lib/prisma'
import { userSkillsSchema } from '@/lib/validators'

export const GET = handler(async (request) => {
  const user = await requireAuth(request, ['jobseeker'])
  return ok({ skills: await getUserSkillList(user.id) })
})

// Replaces the job seeker's full skill list.
export const PUT = handler(async (request) => {
  const user = await requireAuth(request, ['jobseeker'])
  const { skills } = await readJson(request, userSkillsSchema)
  const profile = await prisma.jobSeekerProfile.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } })

  await prisma.$transaction(async (tx) => {
    await tx.userSkill.deleteMany({ where: { profileId: profile.id } })
    for (const item of skills) {
      const skill = await tx.skill.upsert({ where: { name: item.name }, update: {}, create: { name: item.name } })
      await tx.userSkill.create({ data: { profileId: profile.id, skillId: skill.id, level: item.level, score: item.score } })
    }
  })
  return ok({ skills: await getUserSkillList(user.id) })
})
