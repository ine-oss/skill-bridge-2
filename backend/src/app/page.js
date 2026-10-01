const groups = [
  ['Auth', ['POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/me', 'POST /api/auth/logout', 'POST /api/auth/forgot-password', 'POST /api/auth/reset-password', 'POST /api/auth/change-password', 'GET|POST /api/auth/verify-email']],
  ['Users', ['GET|PUT /api/users/me', 'GET|PUT /api/users/me/profile', 'GET|POST /api/users/me/evidence', 'DELETE /api/users/me/evidence/:id', 'GET|PUT /api/users/:id']],
  ['Skills', ['GET|POST /api/skills', 'DELETE /api/skills/:id', 'GET|PUT /api/skills/me', 'GET /api/skills/gap/:userId']],
  ['Jobs', ['GET|POST /api/jobs', 'GET /api/jobs/mine', 'GET /api/jobs/matched', 'GET|PATCH|DELETE /api/jobs/:id', 'POST|DELETE /api/jobs/:id/save', 'GET /api/saved-jobs']],
  ['Companies', ['GET /api/companies', 'GET|PUT /api/companies/me', 'GET /api/companies/:id']],
  ['Hiring', ['GET|POST /api/applications', 'GET|PATCH /api/applications/:id', 'GET|POST /api/interviews', 'PATCH /api/interviews/:id']],
  ['Training', ['GET|POST /api/training', 'GET /api/training/mine', 'GET|PUT /api/training/me', 'GET|PATCH|DELETE /api/training/:id', 'POST /api/training/:id/enroll', 'GET /api/enrollments', 'PATCH /api/enrollments/:id', 'GET /api/certificates', 'GET /api/certificates/verify/:code']],
  ['Files', ['POST /api/uploads (multipart: file, purpose)', 'GET|DELETE /api/files/:id']],
  ['Communication', ['GET|POST /api/messages', 'GET /api/messages/:userId', 'GET /api/notifications', 'PATCH|DELETE /api/notifications/:id', 'POST /api/notifications/read-all']],
  ['Trust & admin', ['GET|POST /api/verification', 'GET /api/dashboard', 'GET /api/admin/analytics', 'GET /api/admin/users', 'PATCH|DELETE /api/admin/users/:id', 'GET /api/admin/verifications', 'PATCH /api/admin/verifications/:id', 'GET /api/admin/audit-logs', 'POST /api/admin/test-email', 'GET /api/health']],
]

export default function Home() {
  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: '48px 20px' }}>
      <h1 style={{ margin: 0 }}>Skill Bridge API</h1>
      <p style={{ color: '#475569' }}>JSON API for the Skill Bridge frontend. Authenticated routes expect <code>Authorization: Bearer &lt;token&gt;</code>.</p>
      {groups.map(([title, routes]) => (
        <section key={title} style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 16, marginBottom: 8 }}>{title}</h2>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8, fontFamily: 'ui-monospace, monospace', fontSize: 14 }}>
            {routes.map((route) => <li key={route}>{route}</li>)}
          </ul>
        </section>
      ))}
    </main>
  )
}
