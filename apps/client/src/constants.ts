
import { io } from "socket.io-client"

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
export const API_PREFIX = import.meta.env.VITE_API_PREFIX ||  "/api/v1"


export const socket: ReturnType<typeof io> = io(API_BASE_URL,)
