import { Outlet } from 'react-router-dom'
import DashboardHeader from '../components/layout/DashboardHeader'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />
      <main className="min-h-screen px-4 py-6 sm:px-7 lg:ml-[264px] lg:px-10 lg:py-9">
        <div className="mx-auto max-w-[1440px]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}