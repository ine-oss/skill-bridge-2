export const applications = [
  {
    id: 1,
    jobTitle: 'Frontend Developer',
    company: 'Northstar Labs',
    status: 'Under Review',
    appliedDate: '2026-09-12',
    match: 85,
    stage: 'Review',
    timeline: [
      { label: 'Applied', date: '2026-09-12', description: 'Application submitted' },
      { label: 'Under Review', date: '2026-09-14', description: 'Portfolio reviewed' },
    ],
  },
  {
    id: 2,
    jobTitle: 'Junior Data Analyst',
    company: 'BluePeak Analytics',
    status: 'Interview',
    appliedDate: '2026-09-10',
    match: 78,
    stage: 'Interview',
    timeline: [
      { label: 'Applied', date: '2026-09-10', description: 'Application submitted' },
      { label: 'Shortlisted', date: '2026-09-13', description: 'Selected for interview' },
      { label: 'Interview', date: '2026-09-20', description: 'Technical interview scheduled' },
    ],
  },
]

export const notifications = [
  { id: 1, title: 'New job match', description: 'Frontend Developer matches your profile at 85%', type: 'job', read: false },
  { id: 2, title: 'Application status changed', description: 'Northstar Labs updated your application to under review', type: 'application', read: false },
  { id: 3, title: 'Training recommended', description: 'SQL for Analytics has been recommended from your skill gap', type: 'training', read: true },
]

export const messages = [
  {
    id: 1,
    name: 'Northstar Labs',
    preview: 'We reviewed your portfolio and would like to schedule a call.',
    time: '10:42 AM',
    unread: 2,
    messages: [
      { from: 'them', text: 'Hi Aisha, thanks for your application.', time: '09:20 AM' },
      { from: 'me', text: 'Thank you, I am happy to discuss further.', time: '09:25 AM' },
      { from: 'them', text: 'We reviewed your portfolio and would like to schedule a call.', time: '10:42 AM' },
    ],
  },
  {
    id: 2,
    name: 'Skill Bridge Support',
    preview: 'Your profile completion is now 84%.',
    time: 'Yesterday',
    unread: 0,
    messages: [{ from: 'them', text: 'Your profile completion is now 84%.', time: 'Yesterday' }],
  },
]
