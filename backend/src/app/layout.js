export const metadata = {
  title: 'Skill Bridge API',
  description: 'Backend API for the Skill Bridge platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, background: '#f8fafc', color: '#0f172a' }}>{children}</body>
    </html>
  )
}
