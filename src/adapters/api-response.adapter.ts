/* eslint-disable @typescript-eslint/no-explicit-any */
import { type AxiosResponse, type AxiosError } from 'axios'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  code?: number
}

const isAxiosError = (response: any): response is AxiosError => {
  return response.isAxiosError === true
}

export const createApiAdapter = <T>(response: AxiosResponse | AxiosError, dataAdapter?: (data: any) => T): ApiResponse<T> => {
  if (isAxiosError(response)) {
    return {
      success: false,
      message: (response.response?.data as { message?: string })?.message ?? response.message ?? '',
      code: response.response?.status
    }
  }

  console.log(response)

  return {
    success: response.status >= 200 && response.status < 300, // TODO:
    data: (dataAdapter != null) ? dataAdapter(response.data.data) : response.data.data,
    code: response.status
  }
}
