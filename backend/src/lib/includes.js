// Shared Prisma `include` shapes so every route returns the same structure.

export const jobInclude = {
  company: true,
  skills: { include: { skill: true } },
  _count: { select: { applications: true } },
}

export const programInclude = {
  provider: true,
  skills: { include: { skill: true } },
  _count: { select: { enrollments: true } },
}

export const applicationInclude = {
  job: { include: jobInclude },
  applicant: true,
  events: { orderBy: { createdAt: 'asc' } },
  interviews: { orderBy: { scheduledAt: 'asc' } },
}
