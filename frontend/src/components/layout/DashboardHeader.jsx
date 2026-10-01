import { useState } from 'react'
import { Bell, BookOpen, BriefcaseBusiness, Building2, FileCheck2, LayoutDashboard, LogOut, Menu, MessageSquare, Search, Settings, ShieldCheck, Users, X } from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import BrandLogo from '../common/BrandLogo'
import useApi from '../../hooks/useApi'
import { notificationService } from '../../services/communicationService'


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
  teaching_center: [
    ['dashboard', '/teaching-center/dashboard'], ['profile', '/training/profile'], ['programs', '/teaching-center/courses'],
    ['learners', '/teaching-center/students'], ['settings', '/training/settings'],
  ],
  admin: [['dashboard', '/admin/dashboard'], ['users', '/admin/users'], ['jobs', '/admin/jobs'], ['applications', '/admin/applications'], ['verification', '/admin/verification'], ['settings', '/admin/settings']],
}

export default function DashboardHeader() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  // Unread count for the bell; refreshed whenever the page changes.
  const unread = useApi(() => notificationService.getNotifications({ unread: true }), [location.pathname])
  const unreadCount = unread.data?.unread || 0
  const onTeachingCenterRoutes = location.pathname.startsWith('/teaching-center')
  const navItems = (user.role === 'training' && onTeachingCenterRoutes ? navByRole.teaching_center : navByRole[user.role]) || navByRole.jobseeker
  const icons = {
    dashboard: LayoutDashboard,
    profile: user.role === 'employer' ? Building2 : FileCheck2,
    skills: ShieldCheck,
    evidence: FileCheck2,
    jobs: Search,
    matchedJobs: Search,
    savedJobs: BriefcaseBusiness,
    applications: BriefcaseBusiness,
    messages: MessageSquare,
    settings: Settings,
    verification: ShieldCheck,
    postJob: BriefcaseBusiness,
    myJobs: BriefcaseBusiness,
    shortlisted: Users,
    interviews: Users,
    analytics: LayoutDashboard,
    programs: BookOpen,
    createTraining: BookOpen,
    learners: Users,
    certificates: FileCheck2,
    users: Users,
  }
  const workspaceBasePath = user.role === 'teaching_center' || onTeachingCenterRoutes ? '/teaching-center' : `/${user.role}`
  const notificationsPath = user.role === 'jobseeker' || user.role === 'admin' ? `/${user.role}/notifications` : `${workspaceBasePath}/dashboard`
  const isTeachingCenter = user.role === 'training' || user.role === 'teaching_center'
  const displayName = user.name || (user.role === 'employer' ? 'Employer workspace' : isTeachingCenter ? 'Teaching center' : 'Job seeker')
  const roleName = user.role === 'jobseeker' ? 'Job seeker' : isTeachingCenter ? 'Teaching center' : user.role
  const signOut = async () => {
    await logout()
    navigate('/login')
  }
  const navigation = (
    <nav className="space-y-1" aria-label="Workspace navigation">
      {navItems.map(([label, path]) => {
        const Icon = icons[label] || LayoutDashboard
        return (
          <NavLink
            key={path}
            to={path}
            end={label === 'dashboard'}
            onClick={() => setOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-[#eaf2ff] text-[#245eb2]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Icon size={18} strokeWidth={1.9} />
            <span>{t(label)}</span>
          </NavLink>
        )
      })}
    </nav>
  )

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-slate-200 bg-white px-5 py-6 lg:flex">
        <Link to={navItems[0][1]} className="mb-9 flex items-center px-1" aria-label="Skill Bridge workspace home">
          <BrandLogo />
        </Link>
        <div className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Workspace</div>
        {navigation}
        <div className="mt-auto border-t border-slate-100 pt-5">
          <div className="mb-4 flex items-center gap-3 px-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eaf2ff] text-sm font-bold text-[#245eb2]">{displayName.charAt(0).toUpperCase()}</span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-slate-900">{displayName}</span>
              <span className="block text-xs capitalize text-slate-500">{roleName}</span>
            </span>
          </div>
          <button type="button" onClick={signOut} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900">
            <LogOut size={18} /> {t('logout')}
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link to={navItems[0][1]} aria-label="Skill Bridge workspace home"><BrandLogo /></Link>
          <div className="flex items-center gap-2">
            <Link to={notificationsPath} className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label={unreadCount ? `${t('notifications')} (${unreadCount} unread)` : t('notifications')}><Bell size={19} />{unreadCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>}</Link>
            <button type="button" onClick={() => setOpen(!open)} className="rounded-lg p-2 text-slate-700 hover:bg-slate-100" aria-label={t('menu')} aria-expanded={open}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {open && <div className="max-h-[calc(100vh-68px)] overflow-y-auto border-t border-slate-100 pb-3 pt-4">{navigation}<button type="button" onClick={signOut} className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"><LogOut size={18} /> {t('logout')}</button></div>}
      </header>
    </>
  )
}