import { API_BASE_URL, API_PREFIX } from "@/constants"
import { getToken } from "@/stores/auth"
import axios from "axios"

const http = axios.create({
  baseURL: API_BASE_URL + API_PREFIX,
})

http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default http
