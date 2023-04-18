// export const socket: ReturnType<typeof io> = io(BASE_URL,)
import { WS_BASE_URL } from "@/constants"
import { io } from "socket.io-client"

export const socket: ReturnType<typeof io> = io(WS_BASE_URL)
