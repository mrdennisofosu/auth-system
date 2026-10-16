import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

// The one way components get the auth state:
//   const { user, isAuthenticated, login, logout } = useAuth()
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === null) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }

  return context
}