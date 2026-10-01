import { requireAuth } from '@/lib/auth'
import { handler, ok } from '@/lib/http'
import { computeMatch, getUserSkillList } from '@/lib/matching'
import { prisma } from '@/lib/prisma'
import { change, histogram, weeklySeries, weeksAgo } from '@/lib/series'
import { initials } from '@/lib/utils'

const WEEKS = 12
const PIPELINE = ['NEW', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'HIRED']
const MATCH_RANGES = [[0, 49, 'Under 50%'], [50, 69, '50–69%'], [70, 84, '70–84%'], [85, 100, '85%+']]
const PROGRESS_RANGES = [[0, 24, '0–24%'], [25, 49, '25–49%'], [50, 74, '50–74%'], [75, 99, '75–99%'], [100, 100, 'Completed']]

const countBy = (rows, key) => rows.reduce((acc, row) => ({ ...acc, [row[key]]: (acc[row[key]] || 0) + 1 }), {})
/** Sum of the last 4 weeks vs the 4 before, for "vs previous 4 weeks" deltas. */
const lastFourWeeks = (series, key) => {
  const recent = series.slice(-4).reduce((sum, row) => sum + row[key], 0)
  const before = series.slice(-8, -4).reduce((sum, row) => sum + row[key], 0)
  return { recent, before, change: change(recent, before) }
}

async function jobSeekerDashboard(user, now) {
  const [profile, applications, interviews, savedJobs, enrollments, unread, activeJobs] = await Promise.all([
    prisma.jobSeekerProfile.findUnique({ where: { userId: user.id }, include: { _count: { select: { skills: true, evidence: true } } } }),
    prisma.application.findMany({ where: { applicantId: user.id }, select: { status: true, createdAt: true, match: true } }),
    prisma.interview.count({ where: { application: { applicantId: user.id }, status: 'SCHEDULED', scheduledAt: { gte: now } } }),
    prisma.savedJob.count({ where: { userId: user.id } }),
    prisma.enrollment.findMany({ where: { userId: user.id }, include: { program: { select: { id: true, title: true } } }, orderBy: { enrolledAt: 'desc' } }),
    prisma.notification.count({ where: { userId: user.id, read: false } }),
    prisma.job.findMany({ where: { status: 'ACTIVE' }, include: { company: { select: { name: true } }, skills: { include: { skill: true } } } }),
  ])
  const userSkills = await getUserSkillList(user.id)
  const owned = new Set(userSkills.map((skill) => skill.name.toLowerCase()))

  // Which skills the open market asks for most, and whether this user has them.
  const demand = {}
  for (const job of activeJobs) for (const link of job.skills) demand[link.skill.name] = (demand[link.skill.name] || 0) + 1
  const marketDemand = Object.entries(demand)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([skill, jobs]) => ({ skill, jobs, have: owned.has(skill.toLowerCase()), score: userSkills.find((item) => item.name.toLowerCase() === skill.toLowerCase())?.score ?? 0 }))

  const topMatches = activeJobs
    .map((job) => ({ id: job.id, title: job.title, company: job.company.name, match: computeMatch(userSkills, job.skills.map((link) => link.skill.name)).match }))
    .sort((a, b) => b.match - a.match)
    .slice(0, 5)

  const byStatus = countBy(applications, 'status')
  return {
    role: user.role,
    profileCompletion: profile?.profileCompletion ?? 0,
    skillsCount: profile?._count.skills ?? 0,
    evidenceCount: profile?._count.evidence ?? 0,
    applications: byStatus,
    totalApplications: applications.length,
    activeApplications: applications.filter((item) => !['REJECTED', 'WITHDRAWN', 'HIRED'].includes(item.status)).length,
    upcomingInterviews: interviews,
    savedJobs,
    activeTraining: enrollments.filter((item) => ['ENROLLED', 'IN_PROGRESS'].includes(item.status)).length,
    unreadNotifications: unread,
    bestMatch: topMatches[0]?.match ?? 0,
    charts: {
      skills: [...userSkills].sort((a, b) => b.score - a.score).map((skill) => ({ skill: skill.name, score: skill.score, level: skill.level })),
      marketDemand,
      topMatches,
      // Current stage of each application; closed outcomes only appear when they happened
      pipeline: [...PIPELINE, 'REJECTED', 'WITHDRAWN'].filter((status) => PIPELINE.includes(status) || byStatus[status]).map((status) => ({ status, count: byStatus[status] || 0 })),
      training: enrollments.map((item) => ({ id: item.id, programId: item.program.id, title: item.program.title, progress: item.progress, status: item.status })),
    },
  }
}

async function employerDashboard(user, now) {
  const owned = { company: { ownerId: user.id } }
  const since = weeksAgo(WEEKS)
  const [jobs, applications, interviews, upcoming] = await Promise.all([
    prisma.job.findMany({ where: owned, select: { id: true, title: true, status: true, _count: { select: { applications: true } } }, orderBy: { createdAt: 'desc' } }),
    prisma.application.findMany({ where: { job: owned }, select: { status: true, match: true, createdAt: true, jobId: true } }),
    prisma.interview.findMany({ where: { application: { job: owned }, scheduledAt: { gte: since } }, select: { scheduledAt: true, status: true } }),
    prisma.interview.count({ where: { application: { job: owned }, status: 'SCHEDULED', scheduledAt: { gte: now } } }),
  ])
  const byStatus = countBy(applications, 'status')
  const weekly = weeklySeries(WEEKS, { applications: { rows: applications, date: (row) => row.createdAt } })
  const trend = lastFourWeeks(weekly, 'applications')
  const reached = (status) => applications.filter((item) => PIPELINE.indexOf(item.status) >= PIPELINE.indexOf(status)).length
  const matchByJob = {}
  for (const item of applications) (matchByJob[item.jobId] ||= []).push(item.match)
  const jobStatus = countBy(jobs, 'status')

  return {
    role: user.role,
    activeJobs: jobStatus.ACTIVE || 0,
    jobs: jobStatus,
    applicants: applications.length,
    shortlisted: byStatus.SHORTLISTED || 0,
    upcomingInterviews: upcoming,
    newApplicants: byStatus.NEW || 0,
    averageMatch: applications.length ? Math.round(applications.reduce((sum, item) => sum + item.match, 0) / applications.length) : 0,
    hires: byStatus.HIRED || 0,
    applicationsTrend: trend,
    charts: {
      weekly,
      // Funnel: how many applicants reached each stage (or went further)
      funnel: PIPELINE.map((status) => ({ status, count: reached(status) })),
      rejected: byStatus.REJECTED || 0,
      matchDistribution: histogram(applications.map((item) => item.match), MATCH_RANGES),
      byJob: jobs
        .filter((job) => job.status !== 'DRAFT')
        .map((job) => ({ id: job.id, title: job.title, status: job.status, applicants: job._count.applications, averageMatch: matchByJob[job.id] ? Math.round(matchByJob[job.id].reduce((a, b) => a + b, 0) / matchByJob[job.id].length) : null }))
        .sort((a, b) => b.applicants - a.applicants),
      interviews: weeklySeries(WEEKS, { interviews: { rows: interviews, date: (row) => row.scheduledAt } }),
    },
  }
}

async function trainingDashboard(user) {
  const owned = { provider: { ownerId: user.id } }
  const [programs, enrollments, certificates] = await Promise.all([
    prisma.trainingProgram.findMany({ where: owned, select: { id: true, title: true, status: true } }),
    prisma.enrollment.findMany({ where: { program: owned }, select: { programId: true, progress: true, status: true, enrolledAt: true, completedAt: true } }),
    prisma.certificate.findMany({ where: { enrollment: { program: owned } }, select: { issuedAt: true } }),
  ])
  const weekly = weeklySeries(WEEKS, {
    enrollments: { rows: enrollments, date: (row) => row.enrolledAt },
    completions: { rows: enrollments.filter((row) => row.completedAt), date: (row) => row.completedAt },
  })
  const active = enrollments.filter((item) => ['ENROLLED', 'IN_PROGRESS'].includes(item.status))
  const completedCount = enrollments.filter((item) => item.status === 'COMPLETED').length
  const byProgram = {}
  for (const item of enrollments) (byProgram[item.programId] ||= []).push(item)

  return {
    role: user.role,
    programs: programs.filter((program) => program.status === 'ACTIVE').length,
    learners: enrollments.length,
    activeLearners: active.length,
    certificates: certificates.length,
    averageCompletion: enrollments.length ? Math.round(enrollments.reduce((sum, item) => sum + item.progress, 0) / enrollments.length) : 0,
    completionRate: enrollments.length ? Math.round((completedCount / enrollments.length) * 100) : 0,
    atRisk: active.filter((item) => item.progress < 25).length,
    enrollmentsTrend: lastFourWeeks(weekly, 'enrollments'),
    charts: {
      weekly,
      progressDistribution: histogram(enrollments.map((item) => item.progress), PROGRESS_RANGES),
      byProgram: programs
        .map((program) => {
          const rows = byProgram[program.id] || []
          return {
            id: program.id,
            title: program.title,
            status: program.status,
            learners: rows.length,
            averageProgress: rows.length ? Math.round(rows.reduce((sum, item) => sum + item.progress, 0) / rows.length) : 0,
            completed: rows.filter((item) => item.status === 'COMPLETED').length,
          }
        })
        .sort((a, b) => b.learners - a.learners),
    },
  }
}

async function adminDashboard(user) {
  const since = weeksAgo(WEEKS)
  const [users, activeJobs, applications, programs, verifiedCompanies, pendingVerifications, recentUsers, recentApplications, recentEnrollments, jobSkills, userSkills, latestUsers] = await Promise.all([
    prisma.user.groupBy({ by: ['role'], _count: true }),
    prisma.job.count({ where: { status: 'ACTIVE' } }),
    prisma.application.groupBy({ by: ['status'], _count: true }),
    prisma.trainingProgram.count({ where: { status: 'ACTIVE' } }),
    prisma.company.count({ where: { verified: true } }),
    prisma.verificationRequest.count({ where: { status: 'UNDER_REVIEW' } }),
    prisma.user.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true, role: true } }),
    prisma.application.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.enrollment.findMany({ where: { enrolledAt: { gte: since } }, select: { enrolledAt: true } }),
    prisma.jobSkill.findMany({ where: { job: { status: 'ACTIVE' } }, select: { skill: { select: { name: true } } } }),
    prisma.userSkill.findMany({ select: { score: true, skill: { select: { name: true } } } }),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 6, select: { id: true, name: true, role: true, createdAt: true, verificationStatus: true } }),
  ])
  const byRole = Object.fromEntries(users.map((row) => [row.role, row._count]))
  const appsByStatus = Object.fromEntries(applications.map((row) => [row.status, row._count]))
  const totalApplications = applications.reduce((sum, row) => sum + row._count, 0)

  const signups = weeklySeries(WEEKS, {
    jobseekers: { rows: recentUsers.filter((row) => row.role === 'jobseeker'), date: (row) => row.createdAt },
    employers: { rows: recentUsers.filter((row) => row.role === 'employer'), date: (row) => row.createdAt },
    providers: { rows: recentUsers.filter((row) => row.role === 'training'), date: (row) => row.createdAt },
  })
  const activity = weeklySeries(WEEKS, {
    applications: { rows: recentApplications, date: (row) => row.createdAt },
    enrollments: { rows: recentEnrollments, date: (row) => row.enrolledAt },
  })
  signups.forEach((row) => { row.total = row.jobseekers + row.employers + row.providers })

  // Skills gap across the platform: how many open jobs ask for a skill vs how many job seekers are strong in it (score ≥ 70)
  const demand = countBy(jobSkills.map((row) => ({ name: row.skill.name })), 'name')
  const supply = countBy(userSkills.filter((row) => row.score >= 70).map((row) => ({ name: row.skill.name })), 'name')
  const skillsGap = Object.entries(demand)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([skill, jobs]) => ({ skill, jobs, talent: supply[skill] || 0 }))

  return {
    role: user.role,
    totalUsers: users.reduce((sum, row) => sum + row._count, 0),
    jobSeekers: byRole.jobseeker || 0,
    employers: byRole.employer || 0,
    trainingProviders: byRole.training || 0,
    admins: byRole.admin || 0,
    activeJobs,
    applications: totalApplications,
    trainingPrograms: programs,
    verifiedCompanies,
    pendingVerifications,
    hires: appsByStatus.HIRED || 0,
    signupsTrend: lastFourWeeks(signups, 'total'),
    applicationsTrend: lastFourWeeks(activity, 'applications'),
    charts: {
      signups,
      activity,
      pipeline: PIPELINE.map((status) => ({ status, count: appsByStatus[status] || 0 })),
      rejected: appsByStatus.REJECTED || 0,
      skillsGap,
      latestUsers: latestUsers.map((row) => ({ ...row, initials: initials(row.name) })),
    },
  }
}

// Summary numbers and chart data for the signed-in user's dashboard.
export const GET = handler(async (request) => {
  const user = await requireAuth(request)
  const now = new Date()
  if (user.role === 'jobseeker') return ok(await jobSeekerDashboard(user, now))
  if (user.role === 'employer') return ok(await employerDashboard(user, now))
  if (user.role === 'training') return ok(await trainingDashboard(user))
  return ok(await adminDashboard(user))
})
