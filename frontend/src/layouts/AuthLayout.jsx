import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#222724]">
      <Outlet />
    </div>
  )
}
