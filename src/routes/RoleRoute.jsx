import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RoleRoute({ role, children }) {
  const { user } = useAuth()

  if (!user.isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== role) {
    return <Navigate to={role === 'jobseeker' ? '/jobseeker/dashboard' : role === 'employer' ? '/employer/dashboard' : role === 'training' ? '/training/dashboard' : '/admin/dashboard'} replace />
  }

  return children
}
