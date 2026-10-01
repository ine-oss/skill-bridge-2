import { z } from 'zod'

const text = (max = 200) => z.string().trim().min(1).max(max)
const optionalText = (max = 500) => z.string().trim().max(max).optional().nullable()
// A web link, or a file uploaded to this API ("/api/files/<id>")
const link = z.union([z.string().trim().url(), z.string().regex(/^\/api\/files\/[a-z0-9]+$/i, 'Invalid file link')])
const stringList = z.array(z.string().trim().min(1).max(200)).max(50)

export const email = z.string().trim().toLowerCase().email()
export const password = z.string().min(8, 'Password must be at least 8 characters').max(128)

export const registerSchema = z.discriminatedUnion('role', [
  z.object({ role: z.literal('jobseeker'), name: text(), email, password, location: optionalText(120) }),
  z.object({ role: z.literal('employer'), name: text(), email, password, contactName: optionalText(120) }),
  z.object({ role: z.literal('training'), name: text(), email, password, pointOfContact: optionalText(120) }),
])

export const loginSchema = z.object({ email, password: z.string().min(1) })
export const forgotPasswordSchema = z.object({ email })
export const resetPasswordSchema = z.object({ token: text(200), password })
export const changePasswordSchema = z.object({ currentPassword: z.string().min(1), newPassword: password })
export const verifyEmailSchema = z.object({ token: text(200) })

export const updateUserSchema = z.object({
  name: text().optional(),
  phone: optionalText(40),
  avatarUrl: link.optional().nullable(),
  emailNotifications: z.boolean().optional(),
})

export const jobSeekerProfileSchema = z.object({
  headline: optionalText(160),
  location: optionalText(120),
  bio: optionalText(2000),
  targetCareer: optionalText(120),
  education: stringList.optional(),
  experience: stringList.optional(),
  languages: stringList.optional(),
  certifications: stringList.optional(),
  portfolioUrl: z.string().url().optional().nullable(),
  cvUrl: link.optional().nullable(),
  linkedinUrl: z.string().url().optional().nullable(),
  githubUrl: z.string().url().optional().nullable(),
})

export const companySchema = z.object({
  name: text().optional(),
  contactName: optionalText(120),
  industry: optionalText(120),
  location: optionalText(120),
  size: optionalText(40),
  website: z.string().url().optional().nullable(),
  description: optionalText(3000),
  logoUrl: link.optional().nullable(),
})

export const providerSchema = z.object({
  name: text().optional(),
  pointOfContact: optionalText(120),
  location: optionalText(120),
  website: z.string().url().optional().nullable(),
  description: optionalText(3000),
})

export const userSkillsSchema = z.object({
  skills: z.array(z.object({
    name: text(80),
    level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).default('BEGINNER'),
    score: z.number().int().min(0).max(100).default(0),
  })).max(100),
})

export const createSkillSchema = z.object({ name: text(80), category: optionalText(80) })

export const evidenceSchema = z.object({
  title: text(160),
  description: optionalText(2000),
  url: link.optional().nullable(),
  skills: stringList.optional(),
})

const jobFields = {
  title: text(160),
  team: optionalText(120),
  location: text(160),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'TEMPORARY']).optional(),
  mode: z.enum(['ONSITE', 'HYBRID', 'REMOTE']).optional(),
  experience: optionalText(80),
  salary: optionalText(80),
  industry: optionalText(120),
  description: text(5000),
  responsibilities: stringList.optional(),
  requirements: stringList.optional(),
  benefits: stringList.optional(),
  skills: stringList.optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED']).optional(),
  deadline: z.coerce.date().optional().nullable(),
}
export const createJobSchema = z.object(jobFields)
export const updateJobSchema = z.object(jobFields).partial()

export const createApplicationSchema = z.object({
  jobId: text(40),
  coverLetter: optionalText(5000),
  resumeUrl: link.optional().nullable(), // defaults to the applicant's uploaded CV
})

export const updateApplicationSchema = z.object({
  status: z.enum(['NEW', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'HIRED', 'REJECTED', 'WITHDRAWN']),
  note: optionalText(1000),
})

export const createInterviewSchema = z.object({
  applicationId: text(40),
  scheduledAt: z.coerce.date(),
  durationMins: z.number().int().min(10).max(480).optional(),
  type: text(120),
  location: optionalText(300),
  notes: optionalText(2000),
})
export const updateInterviewSchema = createInterviewSchema.omit({ applicationId: true }).partial().extend({
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']).optional(),
})

const programFields = {
  title: text(160),
  category: optionalText(120),
  type: optionalText(60),
  mode: z.enum(['ONLINE', 'HYBRID', 'IN_PERSON']).optional(),
  duration: optionalText(60),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  instructor: optionalText(120),
  description: text(5000),
  certificate: z.boolean().optional(),
  price: optionalText(60),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
  startDate: z.coerce.date().optional().nullable(),
  nextSession: z.coerce.date().optional().nullable(),
  skills: stringList.optional(),
}
export const createProgramSchema = z.object(programFields)
export const updateProgramSchema = z.object(programFields).partial()

export const updateEnrollmentSchema = z.object({
  progress: z.number().int().min(0).max(100).optional(),
  status: z.enum(['ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'DROPPED']).optional(),
})

export const sendMessageSchema = z.object({ recipientId: text(40), body: text(5000) })

export const verificationSubmitSchema = z.object({ details: z.record(z.string(), z.any()) })
export const verificationReviewSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  reviewerNote: optionalText(1000),
})

export const adminUpdateUserSchema = z.object({
  status: z.enum(['ACTIVE', 'PENDING', 'SUSPENDED']).optional(),
  role: z.enum(['jobseeker', 'employer', 'training', 'admin']).optional(),
  profileVerified: z.boolean().optional(),
})
