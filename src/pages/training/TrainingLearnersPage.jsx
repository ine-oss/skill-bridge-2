import { useState } from 'react'
import { Search, Users } from 'lucide-react'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import { trainingLearners } from '../../data/trainingWorkspace'

export default function TrainingLearnersPage() {
  const [search, setSearch] = useState('')
  const [course, setCourse] = useState('All programs')
  const courses = ['All programs', ...new Set(trainingLearners.map((learner) => learner.course))]
  const visibleLearners = trainingLearners.filter((learner) => {
    const matchesCourse = course === 'All programs' || learner.course === course
    const matchesSearch = `${learner.name} ${learner.email}`.toLowerCase().includes(search.toLowerCase())
    return matchesCourse && matchesSearch
  })

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Learner management" title="Learners" description="Track enrollment and progress across your active programs." />
      <div className="grid gap-4 sm:grid-cols-3"><div className="card-surface p-5"><p className="text-sm text-slate-500">Learners shown</p><p className="mt-2 text-3xl font-bold text-slate-900">{trainingLearners.length}</p></div><div className="card-surface p-5"><p className="text-sm text-slate-500">On track</p><p className="mt-2 text-3xl font-bold text-emerald-700">{trainingLearners.filter((learner) => learner.status === 'On track').length}</p></div><div className="card-surface p-5"><p className="text-sm text-slate-500">Need attention</p><p className="mt-2 text-3xl font-bold text-amber-700">{trainingLearners.filter((learner) => learner.status === 'Needs attention').length}</p></div></div>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><Users size={17} className="text-blue-700" />Enrollment register</div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative"><span className="sr-only">Search learners</span><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search learners" className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm sm:w-56" /></label>
            <label><span className="sr-only">Filter by program</span><select value={course} onChange={(event) => setCourse(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm sm:w-56">{courses.map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>
        </div>
        <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500"><tr><th className="px-5 py-3">Learner</th><th className="px-4 py-3">Program</th><th className="px-4 py-3">Progress</th><th className="px-4 py-3">Enrolled</th><th className="px-5 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{visibleLearners.map((learner) => <tr key={learner.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${learner.color}`}>{learner.initials}</span><span><span className="block text-sm font-semibold text-slate-800">{learner.name}</span><span className="mt-1 block text-xs text-slate-500">{learner.email}</span></span></div></td><td className="px-4 py-4 text-sm text-slate-600">{learner.course}</td><td className="px-4 py-4"><div className="flex items-center gap-2"><div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${learner.progress}%` }} /></div><span className="text-xs font-semibold text-slate-600">{learner.progress}%</span></div></td><td className="px-4 py-4 text-sm text-slate-500">{learner.date}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${learner.status === 'On track' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{learner.status}</span></td></tr>)}</tbody></table>{visibleLearners.length === 0 && <p className="p-8 text-center text-sm text-slate-500">No learners match this search.</p>}</div>
        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">Showing {visibleLearners.length} of {trainingLearners.length} demo learner records</div>
      </section>
    </div>
  )
}
