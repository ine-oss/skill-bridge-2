import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import AsyncState from '../../components/common/AsyncState'
import useApi from '../../hooks/useApi'
import { skillService } from '../../services/skillService'

export default function AdminSkillsPage() {
  const { data, loading, error, reload } = useApi(() => skillService.getSkills(), [])
  const [form, setForm] = useState({ name: '', category: '' })
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })
  const items = (data?.items || []).filter((skill) => `${skill.name} ${skill.category || ''}`.toLowerCase().includes(search.toLowerCase()))
  const categories = (data?.categories || []).map((category) => category.name)

  const add = async (event) => {
    event.preventDefault()
    try {
      await skillService.addSkill({ name: form.name, category: form.category || undefined })
      setForm({ name: '', category: form.category })
      setMessage({ type: 'success', text: `${form.name} saved.` })
      reload()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
  }
  const remove = async (skill) => {
    const used = skill.users + skill.jobs + skill.programs
    if (!window.confirm(used ? `${skill.name} is used by ${used} profiles, jobs or programs. Delete it everywhere?` : `Delete ${skill.name}?`)) return
    try {
      await skillService.deleteSkill(skill.id)
      reload()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
  }

  return (
    <div className="card-surface p-6">
      <h1 className="text-3xl font-bold text-slate-900">Skills catalogue</h1>
      <p className="mt-2 text-sm text-slate-500">Skills are also created automatically when employers, providers or job seekers use a new one. Keep the catalogue tidy here.</p>
      <form onSubmit={add} className="mt-6 flex flex-col gap-2 rounded-2xl border border-dashed border-slate-300 p-4 sm:flex-row">
        <label className="flex-1"><span className="sr-only">Skill name</span><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Skill name" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label>
        <label className="flex-1"><span className="sr-only">Category</span><input list="skill-categories" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Category (new or existing)" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label>
        <datalist id="skill-categories">{categories.map((name) => <option key={name} value={name} />)}</datalist>
        <button type="submit" className="inline-flex items-center justify-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"><Plus size={16} />Add / update</button>
      </form>
      {message.text && <p className={`mt-3 text-sm ${message.type === 'error' ? 'text-red-700' : 'text-emerald-700'}`} role="status">{message.text}</p>}
      <div className="mt-6">
        <label className="mb-3 block sm:w-72"><span className="sr-only">Filter skills</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Filter skills" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label>
        <AsyncState loading={loading} error={error} onRetry={reload} empty={items.length === 0} emptyTitle="No skills">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Skill</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Job seekers</th><th className="px-4 py-3">Jobs</th><th className="px-4 py-3">Programs</th><th className="px-4 py-3"><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {items.map((skill) => (
                  <tr key={skill.id} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-semibold text-slate-800">{skill.name}</td>
                    <td className="px-4 py-3 text-slate-600">{skill.category || <span className="text-slate-400">Uncategorised</span>}</td>
                    <td className="px-4 py-3">{skill.users}</td>
                    <td className="px-4 py-3">{skill.jobs}</td>
                    <td className="px-4 py-3">{skill.programs}</td>
                    <td className="px-4 py-3 text-right"><button type="button" onClick={() => remove(skill)} aria-label={`Delete ${skill.name}`} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AsyncState>
      </div>
    </div>
  )
}
