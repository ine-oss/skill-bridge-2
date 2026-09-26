import { Menu, Search, UserCircle2 } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import Button from '../common/Button'
import { useLanguage } from '../../context/LanguageContext'

const navItems = [
  { key: 'home', to: '/' },
  { key: 'jobs', to: '/jobs' },
  { key: 'companies', to: '/companies' },
  { key: 'training', to: '/training' },
  { key: 'skills', to: '/skills' },
  { key: 'about', to: '/about' },
]

export default function PublicNavbar() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#bd5639] font-bold text-white">SB</div>
          <div>
            <div className="text-lg font-bold text-slate-900">Skill Bridge</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Skills to Employment</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-blue-700' : 'text-slate-600 hover:text-slate-900'}`
              }
            >
              {t(item.key)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button type="button" className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600">
            <Search size={16} />
            {t('search')}
          </button>
          <label className="flex items-center rounded-xl border border-slate-200 px-2 py-2 text-sm text-slate-600">
            <span className="sr-only">{t('language')}</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value)} className="bg-transparent font-semibold outline-none">
              <option value="en">English</option>
              <option value="sw">Kiswahili</option>
              <option value="rw">Kinyarwanda</option>
              <option value="fr">Français</option>
            </select>
          </label>
          <Link to="/login">
            <Button variant="secondary">{t('login')}</Button>
          </Link>
          <Link to="/register">
            <Button>{t('join')}</Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button className="rounded-xl border border-slate-200 p-2 text-slate-700" aria-label="Open menu">
            <Menu size={18} />
          </button>
          <UserCircle2 className="text-slate-700" size={28} />
        </div>
      </div>
    </header>
  )
}
