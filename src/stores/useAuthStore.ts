import { type User, type AuthUser } from '@/adapters/auth.adapter'
import { authService } from '@/services/AuthService'
import { create } from 'zustand'

interface AuthStore {
  isAuthenticated: boolean
  token: string | null
  user: User | null
  login: (email: string, password: string) => Promise<AuthUser | undefined>
  /* logout: () => void
  checkAuth: () => Promise<void>
  getUser: () => Partial<User> | null */
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  token: authService.getToken(),
  user: null,

  login: async (email, password) => {
    try {
      const response = await authService.login({
        email, password
      })
      set({
        isAuthenticated: true,
        token: response.data?.accessToken,
        user: response.data?.user
      })
      return response.data
    } catch (error) {
      set({
        isAuthenticated: false
      })
      throw error
    }
  }

  /* logout: () => {
    AuthService.logout()
    set({
      isAuthenticated: false,
      user: null
    })
  },

  checkAuth: async () => {
    const token = await AuthService.checkAuth()
    const user = await AuthService.getUser()
    if (token) {
      set({
        isAuthenticated: true,
        user
      })
    }
  },

  getUser: () => {
    return AuthService.getUser()
  } */
}))
