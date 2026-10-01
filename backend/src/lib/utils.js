import { prisma } from './prisma'

export function slugify(value) {
  return value
    .toString()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'item'
}

/** Returns a slug that is unique in the given model (company / trainingProvider). */
export async function uniqueSlug(model, name) {
  const base = slugify(name)
  let slug = base
  for (let i = 2; await prisma[model].findUnique({ where: { slug } }); i += 1) slug = `${base}-${i}`
  return slug
}

/** Finds or creates skills by name and returns their ids. */
export async function upsertSkills(names = []) {
  const unique = [...new Set(names.map((name) => name.trim()).filter(Boolean))]
  const skills = await Promise.all(
    unique.map((name) => prisma.skill.upsert({ where: { name }, update: {}, create: { name } })),
  )
  return skills.map((skill) => skill.id)
}

export function initials(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('')
}
