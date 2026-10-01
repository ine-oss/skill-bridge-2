import { useState } from 'react'
import { ExternalLink, Plus, Trash2 } from 'lucide-react'
import AsyncState from '../../components/common/AsyncState'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import FileLink from '../../components/common/FileLink'
import FileUploadButton from '../../components/common/FileUploadButton'
import useApi from '../../hooks/useApi'
import { formatDate } from '../../lib/format'
import { userService } from '../../services/userService'

const emptyForm = { title: '', description: '', url: '', skills: '' }

export default function JobSeekerEvidencePage() {
  const { data, loading, error, reload, setData } = useApi(() => userService.getEvidence(), [])
  const [form, setForm] = useState(emptyForm)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [saving, setSaving] = useState(false)
  const items = data?.data || []

  const add = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const payload = {
        title: form.title,
        description: form.description || undefined,
        url: form.url || undefined,
        skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      }
      const { evidence } = await userService.addEvidence(payload)
      setData((current) => ({ data: [evidence, ...(current?.data || [])] }))
      setForm(emptyForm)
      setMessage({ type: 'success', text: 'Evidence added.' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    await userService.deleteEvidence(id)
    setData((current) => ({ data: current.data.filter((item) => item.id !== id) }))
  }

  return (
    <div className="space-y-6">
      <div className="card-surface p-6">
        <h1 className="text-3xl font-bold text-slate-900">Evidence</h1>
        <p className="mt-2 text-sm text-slate-500">Projects, repositories, certificates and work samples that prove your skills to employers.</p>

        <form onSubmit={add} className="mt-6 grid gap-4 rounded-2xl border border-dashed border-slate-300 p-5 md:grid-cols-2">
          <Input id="evidence-title" label="Title" required placeholder="e.g. School management system" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          <Input id="evidence-url" label="Link or attached file (optional)" type="text" placeholder="https://github.com/…" value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} />
          <div className="md:col-span-2">
            <label htmlFor="evidence-description" className="field-label">What does it show?</label>
            <textarea id="evidence-description" rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
          </div>
          <Input id="evidence-skills" label="Skills demonstrated (comma separated)" placeholder="React, REST APIs" value={form.skills} onChange={(event) => setForm({ ...form, skills: event.target.value })} />
          <div className="flex flex-wrap items-end gap-3">
            <FileUploadButton purpose="EVIDENCE" label={form.url.startsWith('/api/files/') ? 'File attached ✓' : 'Attach file'} onUploaded={(file) => setForm((current) => ({ ...current, url: file.url }))} />
            <Button type="submit" disabled={saving}><Plus size={16} className="mr-1" />{saving ? 'Adding…' : 'Add evidence'}</Button>
            {message.text && <span className={`text-sm ${message.type === 'error' ? 'text-red-700' : 'text-emerald-700'}`} role="status">{message.text}</span>}
          </div>
        </form>

        <div className="mt-6">
          <AsyncState loading={loading} error={error} onRetry={reload} empty={items.length === 0} emptyTitle="No evidence yet" emptyText="Add your first project or certificate above.">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                    <button type="button" onClick={() => remove(item.id)} aria-label={`Delete ${item.title}`} className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></button>
                  </div>
                  {item.description && <p className="mt-2 text-sm text-slate-600">{item.description}</p>}
                  <div className="mt-3 flex flex-wrap gap-1.5">{item.skills.map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{skill}</span>)}</div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{formatDate(item.createdAt)}</span>
                    {item.url && <FileLink url={item.url} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700">Open <ExternalLink size={12} /></FileLink>}
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
