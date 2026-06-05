import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '@/lib/api'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const data = await authApi.getProfile()
        setUser(data.user)
        setProfile(data.profile)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password, role) => {
    try {
      const data = await authApi.login(email, password, role)
      localStorage.setItem('token', data.token)
      setUser(data.user)
      setProfile(data.profile)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (userData) => {
    try {
      const data = await authApi.register(userData)
      localStorage.setItem('token', data.token)
      setUser(data.user)
      setProfile(data.profile)
      return { user: data.user, error: null }
    } catch (error) {
      return { user: null, error }
    }
  }

  const signOut = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
      setProfile(null)
    }
  }

  const refreshProfile = async () => {
    try {
      const data = await authApi.getProfile()
      setUser(data.user)
      setProfile(data.profile)
    } catch (error) {
      console.error('Profile refresh failed:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
