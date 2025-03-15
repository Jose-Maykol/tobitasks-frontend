export interface ApiLoginResponse {
  user: {
    id: string
    email: string
    name: string
  }
  accessToken: string
}

export interface AuthUser {
  user: User
  accessToken: string
}

export interface User {
  id: string
  email: string
  name: string
}

export const adapterLoginResponse = (data: ApiLoginResponse): AuthUser => ({
  user: {
    id: data.user.id,
    email: data.user.email,
    name: data.user.name
  },
  accessToken: data.accessToken
})
