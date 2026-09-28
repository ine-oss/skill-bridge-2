export const employerJobs = [
  { id: 1, title: 'Senior Frontend Engineer', team: 'Product & Engineering', location: 'Kigali / Hybrid', type: 'Full-time', status: 'Active', applicants: 28, posted: 'Sep 18, 2026', closes: 'Oct 18, 2026' },
  { id: 2, title: 'Product Designer', team: 'Design', location: 'Remote', type: 'Full-time', status: 'Active', applicants: 19, posted: 'Sep 16, 2026', closes: 'Oct 12, 2026' },
  { id: 3, title: 'Data Analyst', team: 'Operations', location: 'Kigali / On-site', type: 'Contract', status: 'Active', applicants: 34, posted: 'Sep 10, 2026', closes: 'Oct 02, 2026' },
  { id: 4, title: 'Customer Success Associate', team: 'Customer Experience', location: 'Kigali / Hybrid', type: 'Full-time', status: 'Draft', applicants: 0, posted: 'Not published', closes: 'Not set' },
]

export const employerApplicants = [
  { id: 1, name: 'Aline Mukamana', initials: 'AM', role: 'Senior Frontend Engineer', applied: 'Sep 28', match: 94, status: 'New', skills: 'React, TypeScript, Accessibility' },
  { id: 2, name: 'Eric Niyonzima', initials: 'EN', role: 'Data Analyst', applied: 'Sep 27', match: 88, status: 'Reviewing', skills: 'SQL, Power BI, Python' },
  { id: 3, name: 'Diane Uwase', initials: 'DU', role: 'Product Designer', applied: 'Sep 26', match: 91, status: 'Shortlisted', skills: 'Figma, Research, Prototyping' },
  { id: 4, name: 'Samuel Habimana', initials: 'SH', role: 'Senior Frontend Engineer', applied: 'Sep 25', match: 82, status: 'New', skills: 'JavaScript, React, CSS' },
  { id: 5, name: 'Olive Ingabire', initials: 'OI', role: 'Data Analyst', applied: 'Sep 24', match: 86, status: 'Shortlisted', skills: 'Excel, SQL, Reporting' },
  { id: 6, name: 'Claude Mugenzi', initials: 'CM', role: 'Product Designer', applied: 'Sep 23', match: 78, status: 'Reviewing', skills: 'Visual design, Figma, UI' },
]

export const employerInterviews = [
  { id: 1, name: 'Aline Mukamana', role: 'Senior Frontend Engineer', date: 'Today', time: '10:30 AM', type: 'Technical interview', initials: 'AM' },
  { id: 2, name: 'Diane Uwase', role: 'Product Designer', date: 'Today', time: '2:00 PM', type: 'Portfolio review', initials: 'DU' },
  { id: 3, name: 'Eric Niyonzima', role: 'Data Analyst', date: 'Tomorrow', time: '11:00 AM', type: 'Hiring manager', initials: 'EN' },
]

export const employerMessages = [
  { id: 1, name: 'Aline Mukamana', initials: 'AM', role: 'Senior Frontend Engineer', time: '10:42 AM', unread: true, messages: [{ from: 'them', text: 'Thank you for reaching out. I am available for the technical interview this week.' }] },
  { id: 2, name: 'Diane Uwase', initials: 'DU', role: 'Product Designer', time: 'Yesterday', unread: true, messages: [{ from: 'them', text: 'I have shared my updated portfolio for your review.' }] },
  { id: 3, name: 'Eric Niyonzima', initials: 'EN', role: 'Data Analyst', time: 'Sep 26', unread: false, messages: [{ from: 'them', text: 'Looking forward to learning more about the role.' }] },
]