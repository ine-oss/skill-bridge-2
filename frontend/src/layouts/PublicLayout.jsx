import { Outlet } from 'react-router-dom'
import PublicNavbar from '../components/navbar/PublicNavbar'
import Footer from '../components/footer/Footer'

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#f3f1ec] text-slate-900">
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
