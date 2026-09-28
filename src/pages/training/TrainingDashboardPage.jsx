import { useState } from 'react'
import { Award, BookOpen, CalendarDays, Clock3, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '../../components/common/StatCard'

const enrollments = [
  { name: 'Aline Mukamana', initials: 'AM', course: 'Frontend Development', progress: 82, date: 'Sep 24, 2026', color: 'bg-sky-100 text-sky-700' },
  { name: 'Eric Niyonzima', initials: 'EN', course: 'Data Analytics with SQL', progress: 64, date: 'Sep 23, 2026', color: 'bg-emerald-100 text-emerald-700' },
  { name: 'Diane Uwase', initials: 'DU', course: 'Digital Product Design', progress: 47, date: 'Sep 22, 2026', color: 'bg-violet-100 text-violet-700' },
  { name: 'Samuel Habimana', initials: 'SH', course: 'Frontend Development', progress: 28, date: 'Sep 21, 2026', color: 'bg-amber-100 text-amber-700' },
  { name: 'Olive Ingabire', initials: 'OI', course: 'Data Analytics with SQL', progress: 91, date: 'Sep 19, 2026', color: 'bg-rose-100 text-rose-700' },
]

const sessions = [
  { day: '29', month: 'SEP', title: 'React state patterns', course: 'Frontend Development', time: '09:00 - 10:30 AM', instructor: 'Grace Uwimana', color: 'border-sky-200 bg-sky-50 text-sky-700' },
  { day: '30', month: 'SEP', title: 'SQL joins workshop', course: 'Data Analytics with SQL', time: '01:00 - 02:30 PM', instructor: 'Claude Mugenzi', color: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  { day: '02', month: 'OCT', title: 'Portfolio critique', course: 'Digital Product Design', time: '10:00 - 11:00 AM', instructor: 'Alice Irakoze', color: 'border-violet-200 bg-violet-50 text-violet-700' },
]

export default function TrainingDashboardPage() {
  const [courseFilter, setCourseFilter] = useState('All programs')
  const courses = ['All programs', ...new Set(enrollments.map((learner) => learner.course))]
  const visibleEnrollments = enrollments.filter((learner) => courseFilter === 'All programs' || learner.course === courseFilter)
  const today = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date())

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">{today}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Training provider dashboard</h1>
          <p className="mt-2 text-base text-slate-500">A clear view of your learners, programs, and upcoming sessions.</p>
        </div>
        <Link to="/training/create" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
          <BookOpen size={17} /> Create a program
        </Link>
      </header>

      <section aria-label="Training provider metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Programs" value="8" subtitle="Active courses" accent="blue" />
        <StatCard title="Learners" value="1,240" subtitle="Enrolled" accent="green" />
        <StatCard title="Certificates" value="312" subtitle="Issued" accent="amber" />
        <div className="card-surface p-5">
          <div className="mb-4 inline-flex rounded-xl bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700">Completion</div>
          <div className="text-3xl font-bold text-slate-900">72%</div>
          <p className="mt-1 text-sm text-slate-500">Average</p>
        </div>
      </section>

      <div className="grid items-start gap-6 2xl:grid-cols-[minmax(0,1.85fr)_minmax(320px,1fr)]">
        <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm" aria-labelledby="enrollments-title">
          <div className="flex flex-col gap-2 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="enrollments-title" className="text-lg font-bold text-slate-800">Recent Course Enrollments</h2>
              <p className="mt-1 text-sm text-slate-500">Learner activity across your active programs</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="sr-only" htmlFor="dashboard-course-filter">Filter enrollments by program</label>
              <select id="dashboard-course-filter" value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700">
                {courses.map((course) => <option key={course}>{course}</option>)}
              </select>
              <Link to="/training/learners" className="text-sm font-semibold text-blue-700 hover:text-blue-800">View all learners</Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3">Student name</th>
                  <th className="px-4 py-3">Registered course</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-6 py-3">Enrollment date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleEnrollments.map((learner) => (
                  <tr key={`${learner.name}-${learner.course}`} className="transition hover:bg-slate-50/70">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${learner.color}`}>{learner.initials}</span>
                        <span className="whitespace-nowrap text-sm font-semibold text-slate-800">{learner.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">{learner.course}</td>
                    <td className="px-4 py-4">
                      <div className="flex min-w-28 items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={`${learner.name} course progress`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={learner.progress}>
                          <div className="h-full rounded-full bg-blue-600" style={{ width: `${learner.progress}%` }} />
                        </div>
                        <span className="w-9 text-right text-xs font-semibold text-slate-600">{learner.progress}%</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{learner.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-xs text-slate-500">
            <span>Showing {visibleEnrollments.length} recent enrollments</span>
            <span className="inline-flex items-center gap-1.5"><Users size={14} /> Updated today</span>
          </div>
        </section>

        <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm" aria-labelledby="schedule-title">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="schedule-title" className="text-lg font-bold text-slate-800">Upcoming Class Schedules</h2>
              <p className="mt-1 text-sm text-slate-500">Your next live learning sessions</p>
            </div>
            <span className="rounded-lg bg-blue-50 p-2 text-blue-700"><CalendarDays size={19} /></span>
          </div>
          <div className="mt-5 space-y-3">
            {sessions.map((session) => (
              <article key={session.title} className="rounded-xl border border-slate-100 p-4">
                <div className="flex gap-3">
                  <div className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border text-center ${session.color}`}>
                    <span className="text-base font-bold leading-5">{session.day}</span>
                    <span className="text-[10px] font-bold tracking-wide">{session.month}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-slate-800">{session.title}</h3>
                    <p className="mt-1 truncate text-xs text-slate-500">{session.course}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1.5"><Clock3 size={14} /> {session.time}</span>
                  <span className="inline-flex items-center gap-1.5"><Award size={14} /> {session.instructor}</span>
                </div>
              </article>
            ))}
          </div>
          <Link to="/training/analytics" className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800">View training analytics <span className="ml-1" aria-hidden="true">-&gt;</span></Link>
        </section>
      </div>
    </div>
  )
}
