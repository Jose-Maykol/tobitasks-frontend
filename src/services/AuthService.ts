import { type ApiResponse, createApiAdapter } from '@/adapters/api-response.adapter'
import { adapterLoginResponse, type AuthUser } from '@/adapters/auth.adapter'
import api from '@/config/axios'
import { type AxiosError } from 'axios'
import Cookies from 'js-cookie'

export interface LoginCredentials {
  email: string
  password: string
}

export const authService = {
  async login (credentials: LoginCredentials): Promise<ApiResponse<AuthUser>> {
    try {
      const response = await api.post('auth/login', credentials)
      const token: string = response.data.token
      Cookies.set('token', token, { expires: 7 })
      return createApiAdapter(response, adapterLoginResponse)
    } catch (error) {
      return createApiAdapter(error as AxiosError)
    }
  }
}

/* class AuthService {
  public async login (email: string, password: string): Promise<void> {
    const response = await api.post('auth/login', { email, password })
    return response.data
  }
}

export default new AuthService() */
