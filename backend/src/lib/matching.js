import { prisma } from './prisma'

const norm = (value) => value.trim().toLowerCase()

/**
 * Skill match between a job seeker and a set of required skill names.
 * Each required skill contributes the user's score for it (0–100); missing skills contribute 0.
 */
export function computeMatch(userSkills, requiredSkills) {
  if (requiredSkills.length === 0) return { match: 100, matched: [], missing: [] }
  const byName = new Map(userSkills.map((item) => [norm(item.name), item.score]))
  const matched = []
  const missing = []
  let total = 0
  for (const skill of requiredSkills) {
    const score = byName.get(norm(skill))
    if (score === undefined) {
      missing.push(skill)
    } else {
      matched.push({ skill, score })
      total += Math.min(100, Math.max(0, score))
    }
  }
  return { match: Math.round(total / requiredSkills.length), matched, missing }
}

export async function getUserSkillList(userId) {
  const profile = await prisma.jobSeekerProfile.findUnique({
    where: { userId },
    include: { skills: { include: { skill: true } } },
  })
  return (profile?.skills || []).map((item) => ({ name: item.skill.name, level: item.level, score: item.score }))
}
