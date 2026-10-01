import { initials } from './utils'

// Shape database rows into the JSON the frontend works with. Never expose passwordHash.

export function serializeUser(user) {
  if (!user) return null
  const { passwordHash: _passwordHash, ...rest } = user
  return { ...rest, initials: initials(user.name), isAuthenticated: true }
}

const skillNames = (links = []) => links.map((link) => link.skill?.name).filter(Boolean)

export function serializeJob(job) {
  if (!job) return null
  const { skills, company, _count, ...rest } = job
  return {
    ...rest,
    skills: skillNames(skills),
    company: company ? { id: company.id, slug: company.slug, name: company.name, location: company.location, verified: company.verified, logoUrl: company.logoUrl } : undefined,
    applicantsCount: _count?.applications,
  }
}

export function serializeProgram(program) {
  if (!program) return null
  const { skills, provider, _count, ...rest } = program
  return {
    ...rest,
    skills: skillNames(skills),
    provider: provider ? { id: provider.id, slug: provider.slug, name: provider.name, verified: provider.verified } : undefined,
    learnersCount: _count?.enrollments,
  }
}

export function serializeApplication(application) {
  if (!application) return null
  const { job, applicant, events, interviews, ...rest } = application
  return {
    ...rest,
    job: job ? serializeJob(job) : undefined,
    applicant: applicant ? { id: applicant.id, name: applicant.name, email: applicant.email, initials: initials(applicant.name) } : undefined,
    timeline: events?.map((event) => ({ status: event.status, note: event.note, date: event.createdAt })),
    interviews,
  }
}
