import { useState } from 'react'
import { Bell, ChevronLeft, House, Languages, Menu, MessageSquare, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'

const navByRole = {
  jobseeker: [
    ['dashboard', '/jobseeker/dashboard'], ['profile', '/jobseeker/profile'], ['skills', '/jobseeker/skills'],
    ['evidence', '/jobseeker/evidence'], ['jobs', '/jobseeker/jobs'], ['applications', '/jobseeker/applications'],
    ['messages', '/jobseeker/messages'], ['settings', '/jobseeker/settings'],
  ],
  employer: [
    ['dashboard', '/employer/dashboard'], ['profile', '/employer/company-profile'], ['verification', '/employer/verification'],
    ['postJob', '/employer/post-job'], ['myJobs', '/employer/jobs'], ['applications', '/employer/applicants'], ['messages', '/employer/messages'],
    ['settings', '/employer/settings'],
  ],
  training: [
    ['dashboard', '/training/dashboard'], ['profile', '/training/profile'], ['programs', '/training/programs'],
    ['createTraining', '/training/create'], ['learners', '/training/learners'], ['settings', '/training/settings'],
  ],
  admin: [['dashboard', '/admin/dashboard'], ['users', '/admin/users'], ['jobs', '/admin/jobs'], ['applications', '/admin/applications'], ['verification', '/admin/verification'], ['settings', '/admin/settings']],
}

export default function DashboardHeader() {
  const { user, logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const navItems = navByRole[user.role] || navByRole.jobseeker
  const baseRole = user.role === 'jobseeker' ? 'jobseeker' : user.role
  const messagesPath = user.role === 'jobseeker' || user.role === 'employer' ? `/${baseRole}/messages` : `/${baseRole}/dashboard`
  const notificationsPath = user.role === 'jobseeker' || user.role === 'admin' ? `/${baseRole}/notifications` : `/${baseRole}/dashboard`

  return (
    <header className="mb-10 border-b border-[#d3cec4] pb-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setOpen(!open)} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700 md:hidden" aria-label={t('menu')}>
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
          <Link to={navItems[0][1]} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#bd5639] font-bold text-white">SB</span>
            <span className="hidden text-lg font-extrabold text-slate-900 sm:block">Skill Bridge</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navigate(-1)} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600" title={t('back')}><ChevronLeft size={18} /></button>
          <Link to="/" className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600" title={t('home')}><House size={18} /></Link>
          <Link to={messagesPath} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600" title={t('messages')}><MessageSquare size={18} /></Link>
          <Link to={notificationsPath} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600" title={t('notifications')}><Bell size={18} /></Link>
          <label className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-2 text-slate-600" title={t('language')}>
            <Languages size={16} />
            <select value={language} onChange={(event) => setLanguage(event.target.value)} className="max-w-20 bg-transparent text-xs font-semibold outline-none">
              <option value="en">English</option><option value="rw">Kinyarwanda</option><option value="sw">Kiswahili</option><option value="fr">Français</option>
            </select>
          </label>
          <button type="button" onClick={logout} className="rounded-lg bg-[#222724] px-3 py-2 text-xs font-bold text-white">{t('logout')}</button>
        </div>
      </div>

      <nav className={`${open ? 'block' : 'hidden'} mt-5 space-y-1 md:flex md:flex-wrap md:gap-x-6 md:gap-y-2 md:space-y-0`}>
        {navItems.map(([label, path]) => <Link key={path} to={path} onClick={() => setOpen(false)} className="block py-2 text-sm font-semibold text-slate-600 hover:text-[#a9472f]">{t(label)}</Link>)}
      </nav>
    </header>
  )
}