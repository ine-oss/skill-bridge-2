import { CheckCircle2, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '../../components/common/StatCard'
import Button from '../../components/common/Button'
import ProgressBar from '../../components/common/ProgressBar'
import { recommendedJobs } from '../../data/jobs'
import { recommendedTraining } from '../../data/training'
import { applications, notifications } from '../../data/applications'
import { useLanguage } from '../../context/LanguageContext'

export default function JobSeekerDashboardPage() {
  const { t } = useLanguage()
  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-[#222724] p-6 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-blue-100">{t('dashboard')}</p>
            <h1 className="mt-2 text-3xl font-bold">Aisha, your pathway is moving forward.</h1>
          </div>
          <Link to="/jobseeker/jobs"><Button className="bg-white text-blue-700 hover:bg-slate-100">Find jobs</Button></Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title={t('completeProfile')} value="84%" subtitle="Keep building your evidence" accent="blue" />
        <StatCard title="Current skill level" value="Advanced" subtitle="Frontend track" accent="green" />
        <StatCard title="Skills count" value="7" subtitle="Strong match for roles" accent="amber" />
        <StatCard title="Applications" value="3" subtitle="2 active this month" accent="slate" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="card-surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Recommended jobs</h2>
            <Link to="/jobseeker/matched-jobs" className="text-sm font-semibold text-blue-700">View all</Link>
          </div>
          <div className="space-y-4">
            {recommendedJobs.map((job) => (
              <div key={job.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-lg font-bold text-slate-900">{job.title}</div>
                    <div className="text-sm text-slate-500">{job.company} · {job.location}</div>
                  </div>
                  <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">85% match</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface p-6">
          <h2 className="text-2xl font-bold text-slate-900">Skill gaps</h2>
          <div className="mt-5 space-y-4">
            {[
              { label: 'React', value: 45 },
              { label: 'SQL', value: 25 },
              { label: 'Git', value: 52 },
            ].map((skill) => (
              <div key={skill.label}>
                <div className="mb-2 flex justify-between text-sm"><span>{skill.label}</span><span>{skill.value}%</span></div>
                <ProgressBar value={skill.value} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="card-surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Recommended training</h2>
            <Link to="/jobseeker/training" className="text-sm font-semibold text-blue-700">See all</Link>
          </div>
          <div className="space-y-4">
            {recommendedTraining.map((program) => (
              <div key={program.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-900">{program.title}</div>
                    <div className="text-sm text-slate-500">{program.provider}</div>
                  </div>
                  <div className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">{program.progress}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface p-6">
          <h2 className="text-2xl font-bold text-slate-900">Upcoming interviews</h2>
          <div className="mt-5 space-y-4">
            {applications.slice(0, 2).map((app) => (
              <div key={app.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="font-semibold text-slate-900">{app.jobTitle}</div>
                <div className="mt-1 text-sm text-slate-500">{app.company}</div>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700"><Clock3 size={12} /> {app.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="card-surface p-6">
          <h2 className="text-2xl font-bold text-slate-900">Career roadmap progress</h2>
          <div className="mt-5 space-y-5">
            {[
              'Learn JavaScript',
              'Learn React',
              'Build projects',
              'Upload evidence',
            ].map((item, index) => (
              <div key={item} className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${index < 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}><CheckCircle2 size={16} /></div>
                <div className="flex-1 text-slate-700">{item}</div>
                <div className="text-sm font-medium text-slate-500">{index < 3 ? 'Complete' : 'Pending'}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface p-6">
          <h2 className="text-2xl font-bold text-slate-900">{t('notifications')}</h2>
          <div className="mt-5 space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="rounded-2xl border border-slate-200 p-3">{notification.title}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
