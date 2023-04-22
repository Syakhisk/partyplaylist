import { createContext, useContext } from "react"
import { io } from "socket.io-client"

// nasty ts bug:
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1332668388
// import type {} from ".pnpm/@socket.io+component-emitter@3.1.0/node_modules/@socket.io/component-emitter"
// import type {} from "socket.io-client"

export const SocketContext = createContext<SocketContextType | null>(null)

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext)

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider")
  }

  return context
}

type IoReturnType = ReturnType<typeof io>
export interface SocketContextType {
  socket: IoReturnType
  status: "idle" | "connected" | "disconnected"
}
