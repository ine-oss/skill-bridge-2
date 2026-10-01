import { prisma } from './prisma'

export const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_MB || 4) * 1024 * 1024 // Vercel caps request bodies at 4.5 MB

const PDF = 'application/pdf'
const DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
const IMAGES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'] // no SVG: it can carry scripts

/** What each kind of upload accepts, and who may upload it. */
export const UPLOAD_RULES = {
  CV: { types: [PDF, DOCX], roles: ['jobseeker'], label: 'a PDF or DOCX file' },
  EVIDENCE: { types: [PDF, ...IMAGES], roles: ['jobseeker'], label: 'a PDF or image' },
  VERIFICATION: { types: [PDF, ...IMAGES], roles: ['jobseeker', 'employer', 'training'], label: 'a PDF or image' },
  LOGO: { types: IMAGES, roles: ['employer', 'training'], label: 'a PNG, JPG, WebP or GIF image' },
  AVATAR: { types: IMAGES, roles: ['jobseeker', 'employer', 'training', 'admin'], label: 'a PNG, JPG, WebP or GIF image' },
}

export const PUBLIC_PURPOSES = ['LOGO', 'AVATAR']

export const fileUrl = (id) => `/api/files/${id}`

/** Pulls the file id out of "/api/files/<id>" (or a full URL ending with it). */
export function fileIdFromUrl(url) {
  const match = /\/api\/files\/([a-z0-9]+)$/i.exec(url || '')
  return match ? match[1] : null
}

/**
 * Who can download a private file:
 *  - its owner and admins
 *  - for CVs and evidence: employers the owner has applied to
 *  - for CVs: training providers the owner is enrolled with
 */
export async function canReadFile(user, file) {
  if (PUBLIC_PURPOSES.includes(file.purpose)) return true
  if (!user) return false
  if (user.role === 'admin' || user.id === file.ownerId) return true
  if (user.role === 'employer' && ['CV', 'EVIDENCE'].includes(file.purpose)) {
    const application = await prisma.application.findFirst({ where: { applicantId: file.ownerId, job: { company: { ownerId: user.id } } }, select: { id: true } })
    return Boolean(application)
  }
  if (user.role === 'training' && file.purpose === 'CV') {
    const enrollment = await prisma.enrollment.findFirst({ where: { userId: file.ownerId, program: { provider: { ownerId: user.id } } }, select: { id: true } })
    return Boolean(enrollment)
  }
  return false
}
