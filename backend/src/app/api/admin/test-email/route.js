import { requireAuth } from '@/lib/auth'
import { handler, ok } from '@/lib/http'
import { isEmailConfigured, sendMail } from '@/lib/mailer'

// Admins can check the SMTP settings: sends a test message to their own address.
export const POST = handler(async (request) => {
  const admin = await requireAuth(request, ['admin'])
  if (!isEmailConfigured()) return ok({ configured: false, delivered: false, message: 'SMTP is not configured — set SMTP_HOST, SMTP_USER and SMTP_PASS in backend/.env' })
  const result = await sendMail({ to: admin.email, subject: 'Skill Bridge test email', text: 'Your SMTP settings work. 🎉', html: '<p>Your SMTP settings work. 🎉</p>' })
  return ok({ configured: true, ...result, message: result.delivered ? `Test email sent to ${admin.email}` : `Sending failed: ${result.error}` })
})
