import { getToken } from "@/stores/auth"
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios"

declare module "axios" {
  export interface AxiosRequestConfig {
    raw?: boolean
    silent?: boolean
  }

  export interface AxiosResponse {
    error: {
      message: string
      status: number
      code: string
      name: string
    }
  }
}

export const injectAuthToken = (config: InternalAxiosRequestConfig) => {
  const token = getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}

export const handleSuccessResponse = (response: AxiosResponse) => {
  if (response.config.raw) {
    return response
  }

  return response.data
}

export const handleErrorResponse = (error: AxiosError) => {
  const config = error?.config

  if (config?.raw) {
    return Promise.reject(error)
  }

  return Promise.resolve({
    error: {
      message: error.message,
      status: error.response?.status,
      code: error.code,
      name: error.name,
    },
  })
}
