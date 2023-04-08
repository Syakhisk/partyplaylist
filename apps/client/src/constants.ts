import { io } from "socket.io-client"
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1"

export const socket: ReturnType<typeof io> = io(API_BASE_URL, { autoConnect: false })
