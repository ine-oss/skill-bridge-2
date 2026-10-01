import nodemailer from 'nodemailer'

/**
 * Email over SMTP. Configure with SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / MAIL_FROM.
 * Gmail: SMTP_HOST=smtp.gmail.com, SMTP_PORT=465, SMTP_USER=you@gmail.com, SMTP_PASS=<16-char app password>.
 * Without SMTP settings, emails are printed to the server console instead (handy in development).
 */
export const isEmailConfigured = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)

let transporter
function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 587)
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  }
  return transporter
}

const appName = () => process.env.APP_NAME || 'Skill Bridge'
const frontendUrl = () => (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '')

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])

function layout({ heading, body, action }) {
  const button = action
    ? `<p style="margin:28px 0"><a href="${escapeHtml(action.url)}" style="background:#1d4ed8;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">${escapeHtml(action.label)}</a></p>
       <p style="color:#64748b;font-size:13px">If the button doesn't work, copy this link into your browser:<br>${escapeHtml(action.url)}</p>`
    : ''
  return `<!doctype html><html><body style="margin:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px">
    <div style="background:#fff;border-radius:16px;padding:32px;border:1px solid #e2e8f0">
      <p style="margin:0 0 16px;font-weight:700;color:#1d4ed8">${escapeHtml(appName())}</p>
      <h1 style="font-size:22px;margin:0 0 12px">${escapeHtml(heading)}</h1>
      <div style="font-size:15px;line-height:1.6;color:#334155">${body}</div>
      ${button}
    </div>
    <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:16px">You received this email because you have an account on ${escapeHtml(appName())}.</p>
  </div></body></html>`
}

/** Sends an email. Never throws: failures are logged so they can't break the request. */
export async function sendMail({ to, subject, text, html }) {
  if (!isEmailConfigured()) {
    console.info(`[email:dev] To: ${to}\n  Subject: ${subject}\n  ${text.replace(/\n/g, '\n  ')}`)
    return { delivered: false }
  }
  try {
    await getTransporter().sendMail({ from: process.env.MAIL_FROM || `${appName()} <${process.env.SMTP_USER}>`, to, subject, text, html })
    return { delivered: true }
  } catch (error) {
    console.error('Email failed:', error.message)
    return { delivered: false, error: error.message }
  }
}

// Templates ------------------------------------------------------------------

export function passwordResetEmail(to, url) {
  return sendMail({
    to,
    subject: `Reset your ${appName()} password`,
    text: `We received a request to reset your password.\n\nOpen this link within 1 hour to choose a new one:\n${url}\n\nIf you didn't ask for this, you can ignore this email.`,
    html: layout({ heading: 'Reset your password', body: '<p>We received a request to reset your password. The link below works for 1 hour.</p><p>If you didn\'t ask for this, you can ignore this email.</p>', action: { label: 'Choose a new password', url } }),
  })
}

export function verificationEmail(to, name, url) {
  return sendMail({
    to,
    subject: `Confirm your email for ${appName()}`,
    text: `Hi ${name},\n\nWelcome to ${appName()}! Confirm your email address by opening this link:\n${url}`,
    html: layout({ heading: `Welcome, ${name}!`, body: '<p>Please confirm your email address so we know it\'s really you.</p>', action: { label: 'Confirm email', url } }),
  })
}

export function notificationEmail(to, { title, description, link }) {
  const url = link ? `${frontendUrl()}${link.startsWith('/') ? link : `/${link}`}` : frontendUrl()
  return sendMail({
    to,
    subject: title,
    text: `${description}\n\nOpen ${appName()}: ${url}`,
    html: layout({ heading: title, body: `<p>${escapeHtml(description)}</p>`, action: { label: `Open ${appName()}`, url } }),
  })
}

export { frontendUrl }
