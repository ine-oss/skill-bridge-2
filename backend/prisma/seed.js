// Seeds the database with the same demo data the React app shows today.
// Run with:  npm run db:seed     (safe to re-run: it clears the tables first)
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client.ts'

if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEED !== 'true') {
  console.error('Refusing to seed: this deletes all data. Set ALLOW_SEED=true if you really want demo data in this database.')
  process.exit(1)
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })

const DEMO_PASSWORD = 'Password123!'
const days = (n) => new Date(Date.now() + n * 86_400_000)

const skillCategories = [
  { slug: 'frontend', name: 'Frontend Development', skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Git', 'REST APIs', 'Accessibility'] },
  { slug: 'data', name: 'Data & Analytics', skills: ['SQL', 'Excel', 'Power BI', 'Python', 'Reporting'] },
  { slug: 'design', name: 'Design', skills: ['Figma', 'User Research', 'Prototyping', 'Visual Design'] },
  { slug: 'marketing', name: 'Marketing', skills: ['SEO', 'Content Strategy', 'Analytics', 'Social Media'] },
  { slug: 'professional', name: 'Professional Skills', skills: ['Communication', 'Interview Skills', 'CV Building'] },
]

async function reset() {
  // Order matters because of foreign keys.
  await prisma.$transaction([
    prisma.auditLog.deleteMany(),
    prisma.authToken.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.message.deleteMany(),
    prisma.verificationRequest.deleteMany(),
    prisma.certificate.deleteMany(),
    prisma.enrollment.deleteMany(),
    prisma.programSkill.deleteMany(),
    prisma.trainingProgram.deleteMany(),
    prisma.interview.deleteMany(),
    prisma.applicationEvent.deleteMany(),
    prisma.application.deleteMany(),
    prisma.savedJob.deleteMany(),
    prisma.jobSkill.deleteMany(),
    prisma.job.deleteMany(),
    prisma.evidence.deleteMany(),
    prisma.userSkill.deleteMany(),
    prisma.skill.deleteMany(),
    prisma.skillCategory.deleteMany(),
    prisma.company.deleteMany(),
    prisma.trainingProvider.deleteMany(),
    prisma.jobSeekerProfile.deleteMany(),
    prisma.user.deleteMany(),
  ])
}

async function main() {
  await reset()
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12)

  // Skills -------------------------------------------------------------------
  const skillId = {}
  for (const category of skillCategories) {
    const created = await prisma.skillCategory.create({ data: { slug: category.slug, name: category.name } })
    for (const name of category.skills) {
      const skill = await prisma.skill.create({ data: { name, categoryId: created.id } })
      skillId[name] = skill.id
    }
  }
  const links = (names) => ({ create: names.map((name) => ({ skillId: skillId[name] })) })

  // Admin ----------------------------------------------------------------------
  await prisma.user.create({
    data: { name: 'Tunde Adeyemi', email: 'admin@skillbridge.app', passwordHash, role: 'admin', emailVerified: true, profileVerified: true, verificationStatus: 'APPROVED' },
  })

  // Employers & companies ----------------------------------------------------
  const employers = [
    { user: { name: 'Mercy Thompson', email: 'employer@skillbridge.app' }, company: { slug: 'northstar', name: 'Northstar Labs', industry: 'Technology', location: 'Kigali, Rwanda', size: '51-200', verified: true, rating: 4.8, description: 'Product studio creating digital experiences for education and fintech teams.' } },
    { user: { name: 'Jean Claude Habineza', email: 'hr@bluepeak.africa' }, company: { slug: 'bluepeak', name: 'BluePeak Analytics', industry: 'Analytics', location: 'Kigali, Rwanda', size: '11-50', verified: true, rating: 4.6, description: 'Data and intelligence consultancy enabling evidence-based decision-making.' } },
    { user: { name: 'Grace Mensah', email: 'talent@riseafrica.co' }, company: { slug: 'rise-africa', name: 'Rise Africa', industry: 'Marketing', location: 'Accra, Ghana', size: '11-50', verified: false, rating: 4.4, description: 'Growth partner for youth-focused brands solving local and regional challenges.' } },
  ]
  const company = {}
  for (const { user, company: data } of employers) {
    const created = await prisma.user.create({
      data: {
        ...user,
        passwordHash,
        role: 'employer',
        emailVerified: true,
        profileVerified: true,
        verificationStatus: data.verified ? 'APPROVED' : 'UNDER_REVIEW',
        company: { create: { ...data, contactName: user.name } },
      },
      include: { company: true },
    })
    company[data.slug] = created.company
  }

  // Jobs -----------------------------------------------------------------------
  const jobData = [
    { key: 'frontend', companyId: company.northstar.id, title: 'Senior Frontend Engineer', team: 'Product & Engineering', location: 'Kigali / Hybrid', employmentType: 'FULL_TIME', mode: 'HYBRID', experience: '3-5 years', salary: '$2,400 / month', industry: 'Technology', status: 'ACTIVE', deadline: days(19), skills: ['React', 'TypeScript', 'JavaScript', 'Accessibility', 'Git'], description: 'Lead customer-facing web experiences and improve accessibility, performance, and design consistency.', responsibilities: ['Build responsive interfaces', 'Mentor junior engineers', 'Ship features with clean, maintainable code'], requirements: ['React', 'TypeScript', 'REST APIs'], benefits: ['Hybrid work', 'Learning budget'] },
    { key: 'fe-dev', companyId: company.northstar.id, title: 'Frontend Developer', team: 'Product & Engineering', location: 'Remote', employmentType: 'FULL_TIME', mode: 'REMOTE', experience: '2-4 years', salary: '$2,200 / month', industry: 'Technology', status: 'ACTIVE', deadline: days(6), skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'], description: 'Build customer-facing web experiences and improve accessibility, performance, and design consistency.', responsibilities: ['Develop responsive web interfaces for B2B products', 'Collaborate with design and product teams'], requirements: ['React', 'JavaScript', 'REST APIs', 'Git'], benefits: ['Remote flexibility', 'Professional development budget'] },
    { key: 'designer', companyId: company.northstar.id, title: 'Product Designer', team: 'Design', location: 'Remote', employmentType: 'FULL_TIME', mode: 'REMOTE', experience: '2-4 years', salary: '$2,000 / month', industry: 'Technology', status: 'ACTIVE', deadline: days(13), skills: ['Figma', 'User Research', 'Prototyping', 'Visual Design'], description: 'Design end-to-end product experiences with research-driven decisions.', responsibilities: ['Run user research', 'Prototype and test flows'], requirements: ['Figma', 'Portfolio'], benefits: ['Remote work', 'Conference budget'] },
    { key: 'support', companyId: company.northstar.id, title: 'Customer Success Associate', team: 'Customer Experience', location: 'Kigali / Hybrid', employmentType: 'FULL_TIME', mode: 'HYBRID', status: 'DRAFT', skills: ['Communication'], description: 'Help customers get value from our products.', responsibilities: [], requirements: [], benefits: [] },
    { key: 'analyst', companyId: company.bluepeak.id, title: 'Junior Data Analyst', team: 'Operations', location: 'Kigali / On-site', employmentType: 'CONTRACT', mode: 'ONSITE', experience: '0-2 years', salary: '$1,500 / month', industry: 'Analytics', status: 'ACTIVE', deadline: days(3), skills: ['SQL', 'Excel', 'Power BI', 'Python'], description: 'Support data reporting and analysis for clients across education and healthcare sectors.', responsibilities: ['Create dashboards', 'Analyze trends', 'Maintain reporting pipelines'], requirements: ['SQL', 'Excel', 'Reporting'], benefits: ['Hybrid work model', 'Mentorship'] },
    { key: 'marketing', companyId: company['rise-africa'].id, title: 'Digital Marketing Specialist', location: 'On-site · Accra', employmentType: 'FULL_TIME', mode: 'ONSITE', experience: '1-3 years', salary: '$1,800 / month', industry: 'Marketing', status: 'ACTIVE', deadline: days(10), skills: ['SEO', 'Content Strategy', 'Analytics', 'Social Media'], description: 'Drive customer acquisition campaigns and content initiatives for youth-led brands.', responsibilities: ['Plan digital campaigns', 'Write briefs', 'Measure performance'], requirements: ['Marketing strategy', 'Analytics'], benefits: ['Health insurance', 'Growth opportunities'] },
  ]
  const job = {}
  for (const { key, skills, ...data } of jobData) {
    const postedAgo = { frontend: 70, 'fe-dev': 56, designer: 42, support: 5, analyst: 63, marketing: 35 }[key] || 30
    job[key] = await prisma.job.create({ data: { ...data, createdAt: days(-postedAgo), publishedAt: data.status === 'ACTIVE' ? days(-postedAgo) : null, skills: links(skills) } })
  }

  // Training providers & programs ---------------------------------------------
  const provider = await prisma.user.create({
    data: {
      name: 'Code Academy Africa', email: 'training@skillbridge.app', passwordHash, role: 'training', emailVerified: true, profileVerified: true, verificationStatus: 'APPROVED',
      trainingProvider: { create: { slug: 'code-academy-africa', name: 'Code Academy Africa', pointOfContact: 'Grace Uwimana', location: 'Kigali, Rwanda', verified: true, description: 'Practical, project-based tech training for young professionals.' } },
    },
    include: { trainingProvider: true },
  })
  const providerId = provider.trainingProvider.id
  const programData = [
    { key: 'frontend', title: 'Frontend Development', category: 'Software development', type: 'Bootcamp', mode: 'ONLINE', duration: '8 weeks', difficulty: 'INTERMEDIATE', instructor: 'Grace Uwimana', status: 'ACTIVE', nextSession: days(0), skills: ['React', 'JavaScript', 'Git'], description: 'Master React building blocks, state management, and component design with practical labs.' },
    { key: 'sql', title: 'Data Analytics with SQL', category: 'Data and analytics', type: 'Course', mode: 'HYBRID', duration: '6 weeks', difficulty: 'BEGINNER', instructor: 'Claude Mugenzi', status: 'ACTIVE', nextSession: days(1), skills: ['SQL', 'Excel', 'Reporting'], description: 'Learn relational databases, querying, and reporting through guided business case studies.' },
    { key: 'design', title: 'Digital Product Design', category: 'Design', type: 'Course', mode: 'ONLINE', duration: '10 weeks', difficulty: 'BEGINNER', instructor: 'Alice Irakoze', status: 'ACTIVE', nextSession: days(3), skills: ['Figma', 'Prototyping', 'User Research'], description: 'Go from research to polished prototypes in a portfolio-driven course.' },
    { key: 'career', title: 'Career Readiness', category: 'Professional skills', type: 'Programme', mode: 'IN_PERSON', duration: '4 weeks', difficulty: 'BEGINNER', instructor: 'Patrick Ndayisaba', status: 'DRAFT', skills: ['Interview Skills', 'CV Building', 'Communication'], description: 'Build employability confidence through CV reviews, mock interviews, and portfolio coaching.' },
  ]
  const program = {}
  for (const { key, skills, ...data } of programData) {
    program[key] = await prisma.trainingProgram.create({ data: { ...data, providerId, skills: links(skills) } })
  }

  // Job seekers ----------------------------------------------------------------
  const seekers = [
    { key: 'aisha', name: 'Aisha Okafor', email: 'jobseeker@skillbridge.app', location: 'Kigali, Rwanda', targetCareer: 'Frontend Developer', headline: 'Frontend developer focused on accessible experiences', skills: [['JavaScript', 'ADVANCED', 90], ['HTML', 'ADVANCED', 95], ['CSS', 'ADVANCED', 90], ['React', 'INTERMEDIATE', 45], ['Python', 'INTERMEDIATE', 68], ['SQL', 'BEGINNER', 25], ['Git', 'INTERMEDIATE', 52]] },
    { key: 'aline', name: 'Aline Mukamana', email: 'aline.mukamana@example.com', location: 'Kigali, Rwanda', targetCareer: 'Frontend Engineer', skills: [['React', 'ADVANCED', 95], ['TypeScript', 'ADVANCED', 90], ['JavaScript', 'EXPERT', 96], ['Accessibility', 'ADVANCED', 88], ['Git', 'ADVANCED', 90]] },
    { key: 'eric', name: 'Eric Niyonzima', email: 'eric.niyonzima@example.com', location: 'Huye, Rwanda', targetCareer: 'Data Analyst', skills: [['SQL', 'ADVANCED', 90], ['Power BI', 'ADVANCED', 85], ['Python', 'INTERMEDIATE', 80], ['Excel', 'ADVANCED', 92]] },
    { key: 'diane', name: 'Diane Uwase', email: 'diane.uwase@example.com', location: 'Kigali, Rwanda', targetCareer: 'Product Designer', skills: [['Figma', 'EXPERT', 95], ['User Research', 'ADVANCED', 88], ['Prototyping', 'ADVANCED', 90], ['Visual Design', 'ADVANCED', 86]] },
    { key: 'samuel', name: 'Samuel Habimana', email: 'samuel.habimana@example.com', location: 'Musanze, Rwanda', targetCareer: 'Frontend Engineer', skills: [['JavaScript', 'ADVANCED', 85], ['React', 'INTERMEDIATE', 75], ['CSS', 'ADVANCED', 85]] },
    { key: 'olive', name: 'Olive Ingabire', email: 'olive.ingabire@example.com', location: 'Kigali, Rwanda', targetCareer: 'Data Analyst', skills: [['Excel', 'EXPERT', 95], ['SQL', 'ADVANCED', 85], ['Reporting', 'ADVANCED', 88]] },
  ]
  const seeker = {}
  for (const [index, { key, skills, location, targetCareer, headline, ...user }] of seekers.entries()) {
    seeker[key] = await prisma.user.create({
      data: {
        ...user,
        createdAt: days(-85 + index * 6),
        passwordHash,
        role: 'jobseeker',
        emailVerified: true,
        profileVerified: true,
        verificationStatus: 'APPROVED',
        jobSeekerProfile: {
          create: {
            location,
            targetCareer,
            headline,
            profileCompletion: 84,
            languages: ['English', 'Kinyarwanda'],
            skills: { create: skills.map(([name, level, score]) => ({ skillId: skillId[name], level, score })) },
          },
        },
      },
    })
  }

  // Applications, interviews ---------------------------------------------------
  // `ago` = how many days ago the application was sent; later stages are spread after it.
  const apply = async (who, jobKey, status, match, extra = [], ago = 10) => {
    const statuses = ['NEW', ...extra, ...(status !== 'NEW' && !extra.includes(status) ? [status] : [])]
    const step = Math.max(1, Math.floor(ago / (statuses.length + 1)))
    return prisma.application.create({
      data: {
        jobId: job[jobKey].id,
        applicantId: seeker[who].id,
        status,
        match,
        createdAt: days(-ago),
        events: { create: statuses.map((s, i) => ({ status: s, note: s === 'NEW' ? 'Application submitted' : null, createdAt: days(-ago + i * step) })) },
      },
    })
  }
  const aline = await apply('aline', 'frontend', 'INTERVIEW', 94, ['REVIEWING', 'SHORTLISTED'], 24)
  const eric = await apply('eric', 'analyst', 'INTERVIEW', 88, ['REVIEWING'], 30)
  const diane = await apply('diane', 'designer', 'SHORTLISTED', 91, ['REVIEWING'], 16)
  await apply('samuel', 'frontend', 'NEW', 82, [], 3)
  await apply('olive', 'analyst', 'SHORTLISTED', 86, ['REVIEWING'], 20)
  await apply('aisha', 'fe-dev', 'REVIEWING', 85, [], 12)
  await apply('aisha', 'analyst', 'NEW', 45, [], 4)
  await apply('aisha', 'marketing', 'REJECTED', 22, ['REVIEWING'], 33)

  // A wider community of learners and applicants so dashboards show realistic activity
  // over the last ~3 months. A fixed-seed generator keeps every run identical.
  let randomState = 20260929
  const random = () => ((randomState = (randomState * 1664525 + 1013904223) % 4294967296) / 4294967296)
  const pick = (list) => list[Math.floor(random() * list.length)]
  const firstNames = ['Jean', 'Claudine', 'Patrick', 'Ange', 'Kevin', 'Grace', 'Emmanuel', 'Divine', 'Fabrice', 'Sandrine', 'Yves', 'Alice', 'Didier', 'Josiane', 'Moses', 'Ruth', 'Innocent', 'Clarisse', 'Bosco', 'Nadia']
  const lastNames = ['Mugisha', 'Uwamahoro', 'Nkurunziza', 'Ishimwe', 'Habimana', 'Mukeshimana', 'Niyonsaba', 'Iradukunda', 'Twagirayezu', 'Umutoni']
  const tracks = [
    { career: 'Frontend Developer', skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'TypeScript'], jobs: ['frontend', 'fe-dev'], program: 'frontend' },
    { career: 'Data Analyst', skills: ['SQL', 'Excel', 'Power BI', 'Python', 'Reporting'], jobs: ['analyst'], program: 'sql' },
    { career: 'Product Designer', skills: ['Figma', 'User Research', 'Prototyping', 'Visual Design'], jobs: ['designer'], program: 'design' },
    { career: 'Digital Marketer', skills: ['SEO', 'Content Strategy', 'Analytics', 'Social Media'], jobs: ['marketing'], program: null },
  ]
  const outcome = () => {
    const r = random()
    if (r < 0.32) return ['NEW', []]
    if (r < 0.55) return ['REVIEWING', []]
    if (r < 0.7) return ['SHORTLISTED', ['REVIEWING']]
    if (r < 0.8) return ['INTERVIEW', ['REVIEWING', 'SHORTLISTED']]
    if (r < 0.85) return ['OFFERED', ['REVIEWING', 'SHORTLISTED', 'INTERVIEW']]
    if (r < 0.88) return ['HIRED', ['REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'OFFERED']]
    return ['REJECTED', ['REVIEWING']]
  }
  for (let i = 0; i < 28; i += 1) {
    const track = tracks[i % tracks.length]
    const name = `${firstNames[i % firstNames.length]} ${lastNames[(i * 3) % lastNames.length]}`
    const key = `member${i}`
    const joinedAgo = 90 - Math.floor(i * 3 + random() * 4)
    const skills = track.skills.filter(() => random() > 0.25).map((skillName) => {
      const score = Math.round(30 + random() * 65)
      return { skillId: skillId[skillName], score, level: score >= 85 ? 'ADVANCED' : score >= 55 ? 'INTERMEDIATE' : 'BEGINNER' }
    })
    seeker[key] = await prisma.user.create({
      data: {
        name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}${i}@example.com`,
        passwordHash,
        role: 'jobseeker',
        emailVerified: true,
        createdAt: days(-joinedAgo),
        jobSeekerProfile: { create: { location: pick(['Kigali, Rwanda', 'Huye, Rwanda', 'Musanze, Rwanda', 'Rubavu, Rwanda']), targetCareer: track.career, profileCompletion: Math.round(40 + random() * 55), languages: ['Kinyarwanda', 'English'], skills: { create: skills } } },
      },
    })
    const applyAgo = Math.max(1, Math.floor(joinedAgo - 2 - random() * 20))
    const [status, path] = outcome()
    const average = skills.length ? Math.round(skills.reduce((sum, item) => sum + item.score, 0) / track.skills.length) : 20
    await apply(key, pick(track.jobs), status, Math.min(98, average), path, applyAgo)
    if (track.program && random() < 0.7) {
      const enrolledAgo = Math.max(1, Math.floor(joinedAgo - random() * 10))
      const progress = Math.min(100, Math.round(random() * 110))
      const done = progress >= 100
      const enrollment = await prisma.enrollment.create({ data: { userId: seeker[key].id, programId: program[track.program].id, progress, enrolledAt: days(-enrolledAgo), status: done ? 'COMPLETED' : 'IN_PROGRESS', completedAt: done ? days(-Math.max(0, enrolledAgo - 30)) : null } })
      if (done) await prisma.certificate.create({ data: { code: `SB-2026-${1100 + i}`, enrollmentId: enrollment.id, issuedAt: days(-Math.max(0, enrolledAgo - 30)) } })
    }
  }

  const at = (dayOffset, hour, minute = 0) => { const d = days(dayOffset); d.setHours(hour, minute, 0, 0); return d }
  await prisma.interview.createMany({
    data: [
      { applicationId: aline.id, scheduledAt: at(1, 10, 30), type: 'Technical interview', location: 'Google Meet' },
      { applicationId: diane.id, scheduledAt: at(1, 14), type: 'Portfolio review', location: 'Northstar Labs office' },
      { applicationId: eric.id, scheduledAt: at(2, 11), type: 'Hiring manager', location: 'BluePeak office' },
    ],
  })

  await prisma.savedJob.createMany({ data: [{ userId: seeker.aisha.id, jobId: job.frontend.id }, { userId: seeker.aisha.id, jobId: job.designer.id }] })

  // Enrollments & certificates -------------------------------------------------
  const enroll = (who, programKey, progress, ago = 20) =>
    prisma.enrollment.create({ data: { userId: seeker[who].id, programId: program[programKey].id, progress, enrolledAt: days(-ago), status: progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS', completedAt: progress >= 100 ? days(-2) : null } })
  await enroll('aline', 'frontend', 82, 60)
  await enroll('eric', 'sql', 64, 45)
  await enroll('diane', 'design', 47, 38)
  await enroll('samuel', 'frontend', 28, 9)
  await enroll('aisha', 'frontend', 72, 50)
  await enroll('aisha', 'sql', 41, 18)
  const completed = await enroll('olive', 'sql', 100, 52)
  await prisma.certificate.create({ data: { code: 'SB-2026-1048', enrollmentId: completed.id, issuedAt: days(-2) } })

  // Messages & notifications ---------------------------------------------------
  const mercy = await prisma.user.findUnique({ where: { email: 'employer@skillbridge.app' } })
  await prisma.message.createMany({
    data: [
      { senderId: mercy.id, recipientId: seeker.aisha.id, body: 'Hi Aisha, thanks for your application.', createdAt: days(-1), readAt: days(-1) },
      { senderId: seeker.aisha.id, recipientId: mercy.id, body: 'Thank you, I am happy to discuss further.', createdAt: days(-0.9), readAt: days(-0.9) },
      { senderId: mercy.id, recipientId: seeker.aisha.id, body: 'We reviewed your portfolio and would like to schedule a call.' },
      { senderId: seeker.aline.id, recipientId: mercy.id, body: 'Thank you for reaching out. I am available for the technical interview this week.' },
      { senderId: seeker.diane.id, recipientId: mercy.id, body: 'I have shared my updated portfolio for your review.' },
    ],
  })
  await prisma.notification.createMany({
    data: [
      { userId: seeker.aisha.id, title: 'New job match', description: 'Frontend Developer at Northstar Labs matches your profile', type: 'JOB', link: '/jobseeker/matched-jobs' },
      { userId: seeker.aisha.id, title: 'Application status changed', description: 'Northstar Labs updated your application to reviewing', type: 'APPLICATION', link: '/jobseeker/applications' },
      { userId: seeker.aisha.id, title: 'Training recommended', description: 'Data Analytics with SQL fills a gap in your skills', type: 'TRAINING', read: true },
      { userId: mercy.id, title: 'New applicant', description: 'Samuel Habimana applied for Senior Frontend Engineer (82% match)', type: 'APPLICATION', link: '/employer/applicants' },
    ],
  })

  // Pending verification for the admin queue
  const rise = await prisma.user.findUnique({ where: { email: 'talent@riseafrica.co' } })
  await prisma.verificationRequest.create({ data: { userId: rise.id, details: { registrationNumber: 'GH-2024-55821', website: 'https://riseafrica.co' } } })

  console.log('Seed complete. Demo accounts (password: %s):', DEMO_PASSWORD)
  console.table([
    { role: 'admin', email: 'admin@skillbridge.app' },
    { role: 'employer', email: 'employer@skillbridge.app' },
    { role: 'training', email: 'training@skillbridge.app' },
    { role: 'jobseeker', email: 'jobseeker@skillbridge.app' },
  ])
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
