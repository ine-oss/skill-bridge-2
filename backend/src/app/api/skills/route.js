import { audit } from '@/lib/audit'
import { requireAuth } from '@/lib/auth'
import { created, handler, ok, readJson } from '@/lib/http'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { createSkillSchema } from '@/lib/validators'

// Public: skill catalogue grouped by category.
export const GET = handler(async () => {
  const [categories, uncategorized, usage] = await Promise.all([
    prisma.skillCategory.findMany({ include: { skills: { orderBy: { name: 'asc' } } }, orderBy: { name: 'asc' } }),
    prisma.skill.findMany({ where: { categoryId: null }, orderBy: { name: 'asc' } }),
    prisma.skill.findMany({ include: { category: true, _count: { select: { userSkills: true, jobSkills: true, programSkills: true } } }, orderBy: { name: 'asc' } }),
  ])
  return ok({
    items: usage.map((skill) => ({ id: skill.id, name: skill.name, category: skill.category?.name || null, users: skill._count.userSkills, jobs: skill._count.jobSkills, programs: skill._count.programSkills })),
    categories: categories.map((category) => ({ id: category.slug, name: category.name, skills: category.skills.map((skill) => skill.name) })),
    uncategorized: uncategorized.map((skill) => skill.name),
  })
})

// Admin: add a skill to the catalogue.
export const POST = handler(async (request) => {
  const admin = await requireAuth(request, ['admin'])
  const { name, category } = await readJson(request, createSkillSchema)
  let categoryId = null
  if (category) {
    const slug = slugify(category)
    const record = await prisma.skillCategory.upsert({ where: { slug }, update: {}, create: { slug, name: category } })
    categoryId = record.id
  }
  const skill = await prisma.skill.upsert({ where: { name }, update: { categoryId }, create: { name, categoryId } })
  await audit(admin.id, 'skill.create', { entity: 'Skill', entityId: skill.id })
  return created({ skill })
})
