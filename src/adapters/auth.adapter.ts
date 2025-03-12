export interface ApiLoginResponse {
  user: {
    id: string
    email: string
    name: string
  }
  accessToken: string
}

export interface AdaptedLoginResponse {
  user: {
    id: string
    email: string
    name: string
  }
  accessToken: string
}

export const adapterLoginResponse = (data: ApiLoginResponse): AdaptedLoginResponse => ({
  user: {
    id: data.user.id,
    email: data.user.email,
    name: data.user.name
  },
  accessToken: data.accessToken
})
