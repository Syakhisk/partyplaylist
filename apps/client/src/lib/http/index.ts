import { API_BASE_URL, API_PREFIX } from "@/constants"
import axios from "axios"
import { handleErrorResponse, handleSuccessResponse, injectAuthToken } from "./handler"

const http = axios.create({
  baseURL: API_BASE_URL + API_PREFIX,
})

http.interceptors.request.use(injectAuthToken)

http.interceptors.response.use(handleSuccessResponse, handleErrorResponse)

export default http
