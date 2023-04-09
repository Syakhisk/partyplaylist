
import { io } from "socket.io-client"
const BASE_URL = "http://localhost:3000"
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? `${BASE_URL}/api/v1`

export const socket: ReturnType<typeof io> = io(BASE_URL,)
