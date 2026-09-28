import { useState } from 'react'
import { ArrowRight, Award, BookOpen, TrendingUp, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import { trainingLearners, trainingPrograms } from '../../data/trainingWorkspace'

const trends = {
  'This month': { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], values: [42, 58, 49, 78] },
  'Last 3 months': { labels: ['Jul', 'Aug', 'Sep'], values: [48, 64, 78] },
}

export default function TrainingAnalyticsPage() {
  const [period, setPeriod] = useState('This month')
  const trend = trends[period]
  const averageProgress = Math.round(trainingLearners.reduce((total, learner) => total + learner.progress, 0) / trainingLearners.length)

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Provider insights" title="Analytics" description="Monitor enrollment, learner progress, and program outcomes at a glance." actionLabel="View programs" actionTo="/training/programs" icon={ArrowRight} />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Training metrics">
        {[[Users, 'Enrolled learners', '1,240', '+12% from last month', 'text-blue-700 bg-blue-50'], [BookOpen, 'Active programs', trainingPrograms.filter((program) => program.status === 'Active').length, 'Across 3 learning areas', 'text-emerald-700 bg-emerald-50'], [TrendingUp, 'Average progress', `${averageProgress}%`, 'From current learners', 'text-amber-700 bg-amber-50'], [Award, 'Certificates issued', '312', 'This year', 'text-rose-700 bg-rose-50']].map(([Icon, label, value, detail, color]) => <div key={label} className="card-surface p-5"><span className={`inline-flex rounded-lg p-2 ${color}`}><Icon size={18} /></span><p className="mt-4 text-sm text-slate-500">{label}</p><p className="mt-1 text-3xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>)}
      </section>
      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
        <div className="card-surface p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="text-lg font-bold text-slate-900">Enrollment trend</h2><p className="mt-1 text-sm text-slate-500">Learner activity across your programs</p></div><div className="flex gap-1 rounded-lg bg-slate-100 p-1" role="group" aria-label="Analytics period">{Object.keys(trends).map((item) => <button key={item} type="button" aria-pressed={period === item} onClick={() => setPeriod(item)} className={`rounded-md px-3 py-2 text-xs font-semibold ${period === item ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{item}</button>)}</div></div>
          <div className="mt-8 flex h-56 items-end justify-around gap-4 border-b border-slate-100 px-4">{trend.values.map((value, index) => <div key={trend.labels[index]} className="flex h-full w-full max-w-24 flex-col items-center justify-end gap-2"><span className="text-xs font-semibold text-slate-600">{value}%</span><div className="w-full rounded-t-md bg-emerald-600 transition-all" style={{ height: `${value}%` }} /><span className="pb-3 text-xs text-slate-500">{trend.labels[index]}</span></div>)}</div>
          <p className="mt-3 text-xs text-slate-400">Illustrative enrollment trend</p>
        </div>
        <div className="card-surface p-5 sm:p-6"><h2 className="text-lg font-bold text-slate-900">Program performance</h2><p className="mt-1 text-sm text-slate-500">Average learner completion</p><div className="mt-5 space-y-5">{trainingPrograms.filter((program) => program.status === 'Active').map((program) => <div key={program.id}><div className="mb-2 flex justify-between gap-3 text-sm"><span className="truncate font-medium text-slate-700">{program.title}</span><span className="font-semibold text-slate-800">{program.completion}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${program.completion}%` }} /></div></div>)}</div><Link to="/training/learners" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">Review learner progress <ArrowRight size={15} /></Link></div>
      </section>
    </div>
  )
}
