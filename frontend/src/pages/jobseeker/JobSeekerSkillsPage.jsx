import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import AsyncState from '../../components/common/AsyncState'
import Button from '../../components/common/Button'
import useApi from '../../hooks/useApi'
import { label } from '../../lib/format'
import { skillService } from '../../services/skillService'

const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']
const defaultScore = { BEGINNER: 25, INTERMEDIATE: 55, ADVANCED: 80, EXPERT: 95 }

export default function JobSeekerSkillsPage() {
  const { data, loading, error, reload } = useApi(async () => {
    const [mine, catalogue] = await Promise.all([skillService.getMySkills(), skillService.getSkills()])
    return { skills: mine.skills, suggestions: [...catalogue.categories.flatMap((category) => category.skills), ...catalogue.uncategorized] }
  }, [])
  const [draft, setDraft] = useState(null)
  const [newSkill, setNewSkill] = useState({ name: '', level: 'BEGINNER' })
  const [status, setStatus] = useState({ type: '', text: '' })
  const [saving, setSaving] = useState(false)

  const skills = draft ?? data?.skills ?? []
  const edit = (next) => {
    setDraft(next)
    setStatus({ type: '', text: '' })
  }
  const update = (name, changes) => edit(skills.map((skill) => skill.name === name ? { ...skill, ...changes } : skill))
  const remove = (name) => edit(skills.filter((skill) => skill.name !== name))
  const add = (event) => {
    event.preventDefault()
    const name = newSkill.name.trim()
    if (!name || skills.some((skill) => skill.name.toLowerCase() === name.toLowerCase())) return
    edit([...skills, { name, level: newSkill.level, score: defaultScore[newSkill.level] }])
    setNewSkill({ name: '', level: 'BEGINNER' })
  }
  const save = async () => {
    setSaving(true)
    try {
      const result = await skillService.updateMySkills(skills.map(({ name, level, score }) => ({ name, level, score: Number(score) })))
      setDraft(result.skills)
      setStatus({ type: 'success', text: 'Skills saved. Your job matches are updated.' })
    } catch (err) {
      setStatus({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My skills</h1>
            <p className="mt-1 text-sm text-slate-500">Rate each skill honestly — scores drive your job matches and skill gap.</p>
          </div>
          <Button onClick={save} disabled={saving || draft === null}>{saving ? 'Saving…' : 'Save skills'}</Button>
        </div>
        {status.text && <p className={`mt-3 text-sm font-medium ${status.type === 'error' ? 'text-red-700' : 'text-emerald-700'}`} role="status">{status.text}</p>}

        <form onSubmit={add} className="mt-6 flex flex-col gap-2 rounded-2xl border border-dashed border-slate-300 p-4 sm:flex-row">
          <label className="sr-only" htmlFor="new-skill">Skill name</label>
          <input id="new-skill" list="skill-suggestions" value={newSkill.name} onChange={(event) => setNewSkill({ ...newSkill, name: event.target.value })} placeholder="Add a skill, e.g. React" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <datalist id="skill-suggestions">{(data?.suggestions || []).map((name) => <option key={name} value={name} />)}</datalist>
          <label className="sr-only" htmlFor="new-skill-level">Level</label>
          <select id="new-skill-level" value={newSkill.level} onChange={(event) => setNewSkill({ ...newSkill, level: event.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            {LEVELS.map((level) => <option key={level} value={level}>{label(level)}</option>)}
          </select>
          <Button type="submit" variant="secondary"><Plus size={16} className="mr-1" /> Add</Button>
        </form>

        <div className="mt-6">
          <AsyncState loading={loading} error={error} onRetry={reload} empty={skills.length === 0} emptyTitle="No skills yet" emptyText="Add the skills you have so we can match you with jobs.">
            <div className="grid gap-4 md:grid-cols-2">
              {skills.map((skill) => (
                <div key={skill.name} className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="font-semibold text-slate-900">{skill.name}</div>
                    <div className="flex items-center gap-2">
                      <label className="sr-only" htmlFor={`level-${skill.name}`}>{skill.name} level</label>
                      <select id={`level-${skill.name}`} value={skill.level} onChange={(event) => update(skill.name, { level: event.target.value })} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs">
                        {LEVELS.map((level) => <option key={level} value={level}>{label(level)}</option>)}
                      </select>
                      <button type="button" onClick={() => remove(skill.name)} aria-label={`Remove ${skill.name}`} className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="sr-only" htmlFor={`score-${skill.name}`}>{skill.name} score</label>
                    <input id={`score-${skill.name}`} type="range" min="0" max="100" value={skill.score} onChange={(event) => update(skill.name, { score: Number(event.target.value) })} className="flex-1 accent-blue-600" />
                    <span className="w-10 text-right text-sm font-semibold text-slate-600">{skill.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </AsyncState>
        </div>
      </div>
    </div>
  )
}
