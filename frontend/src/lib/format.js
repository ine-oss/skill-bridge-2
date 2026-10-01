// Turns API values (enums, ISO dates, nested objects) into the labels the UI shows.

const LABELS = {
  FULL_TIME: 'Full-time', PART_TIME: 'Part-time', CONTRACT: 'Contract', INTERNSHIP: 'Internship', TEMPORARY: 'Temporary',
  ONSITE: 'On-site', HYBRID: 'Hybrid', REMOTE: 'Remote',
  ONLINE: 'Online', IN_PERSON: 'In person',
  BEGINNER: 'Beginner', INTERMEDIATE: 'Intermediate', ADVANCED: 'Advanced', EXPERT: 'Expert',
  DRAFT: 'Draft', ACTIVE: 'Active', PAUSED: 'Paused', CLOSED: 'Closed', ARCHIVED: 'Archived',
  NEW: 'New', REVIEWING: 'Reviewing', SHORTLISTED: 'Shortlisted', INTERVIEW: 'Interview', OFFERED: 'Offered', HIRED: 'Hired', REJECTED: 'Rejected', WITHDRAWN: 'Withdrawn',
  SCHEDULED: 'Scheduled', COMPLETED: 'Completed', CANCELLED: 'Cancelled',
  ENROLLED: 'Enrolled', IN_PROGRESS: 'In progress', DROPPED: 'Dropped',
  NOT_SUBMITTED: 'Not submitted', UNDER_REVIEW: 'Under review', APPROVED: 'Approved',
  PENDING: 'Pending', SUSPENDED: 'Suspended',
  jobseeker: 'Job Seeker', employer: 'Employer', training: 'Training Provider', admin: 'Admin',
}

export const label = (value) => (value ? LABELS[value] || value : '')

export function formatDate(value, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!value) return 'Not set'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat('en', options).format(date)
}

export const formatShortDate = (value) => formatDate(value, { month: 'short', day: 'numeric' })

export function formatTime(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(value))
}

/** "Today", "Tomorrow" or "Oct 2" */
export function formatDay(value) {
  const date = new Date(value)
  const today = new Date()
  const startOf = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const diff = Math.round((startOf(date) - startOf(today)) / 86_400_000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  return formatShortDate(value)
}

export function timeAgo(value) {
  if (!value) return ''
  const seconds = Math.round((Date.now() - new Date(value).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const units = [['year', 31_536_000], ['month', 2_592_000], ['week', 604_800], ['day', 86_400], ['hour', 3_600], ['minute', 60]]
  for (const [unit, size] of units) {
    const amount = Math.floor(seconds / size)
    if (amount >= 1) return `${amount} ${unit}${amount > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

export const initialsOf = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('')

// Shapes the existing cards and pages already understand ------------------------------

export function toJobView(job) {
  return {
    ...job,
    companyId: job.company?.slug || job.company?.id,
    company: job.company?.name || '',
    employmentType: label(job.employmentType),
    mode: label(job.mode),
    status: label(job.status),
    experience: job.experience || 'Any experience',
    salary: job.salary || 'Salary not listed',
    posted: timeAgo(job.publishedAt || job.createdAt),
    deadline: job.deadline ? formatDate(job.deadline) : 'Open',
    skills: job.skills || [],
    responsibilities: job.responsibilities || [],
    requirements: job.requirements || [],
    benefits: job.benefits || [],
  }
}

export function toCompanyView(company) {
  return { ...company, id: company.slug || company.id, industry: company.industry || 'Industry not set', location: company.location || 'Location not set', size: company.size || 'Not set' }
}

export function toProgramView(program) {
  return {
    ...program,
    provider: program.provider?.name || '',
    type: program.type || 'Course',
    mode: label(program.mode),
    difficulty: label(program.difficulty),
    status: label(program.status),
    duration: program.duration || 'Self-paced',
    skills: program.skills || [],
    learners: program.learnersCount ?? 0,
    nextSession: program.nextSession ? formatDate(program.nextSession) : 'Not scheduled',
  }
}

export function toApplicantView(application) {
  return {
    id: application.id,
    applicantId: application.applicant?.id,
    name: application.applicant?.name || '',
    initials: application.applicant?.initials || initialsOf(application.applicant?.name),
    role: application.job?.title || '',
    jobId: application.job?.id,
    applied: formatShortDate(application.createdAt),
    match: application.match,
    status: label(application.status),
    rawStatus: application.status,
    resumeUrl: application.resumeUrl,
    coverLetter: application.coverLetter,
    skills: (application.job?.skills || []).join(', '),
  }
}

// Badge colours for application statuses (by label)
export const applicantStatusStyles = {
  New: 'bg-blue-50 text-blue-700',
  Reviewing: 'bg-amber-50 text-amber-700',
  Shortlisted: 'bg-emerald-50 text-emerald-700',
  Interview: 'bg-violet-50 text-violet-700',
  Offered: 'bg-emerald-50 text-emerald-800',
  Hired: 'bg-emerald-600 text-white',
  Rejected: 'bg-red-50 text-red-700',
  Withdrawn: 'bg-slate-100 text-slate-500',
}


/** Value for an <input type="datetime-local"> in the viewer's own timezone. */
export function toDateTimeLocal(value) {
  if (!value) return ''
  const date = new Date(value)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
}
