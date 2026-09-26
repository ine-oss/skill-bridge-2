import { Outlet } from 'react-router-dom'
import DashboardHeader from '../components/layout/DashboardHeader'

export default function EmployerLayout() {
  return (
    <div className="min-h-screen bg-[#f3f1ec]">
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-12">
        <DashboardHeader />
        <Outlet />
      </div>
    </div>
  )
}
