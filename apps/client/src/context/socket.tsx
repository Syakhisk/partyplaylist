import React, { PropsWithChildren, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { API_BASE_URL } from "@/constants"
import { useUserStore } from "@/stores/auth"

export const SocketContext = React.createContext<ReturnType<typeof io> | null>(null)

export const useSocket = () => {
  const context = React.useContext(SocketContext)

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider")
  }

  return context
}

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const token = useUserStore((s) => s.token)
  const [socket] = useState<ReturnType<typeof io>>(() =>
    io(API_BASE_URL, {
      autoConnect: false,
    })
  )

  useEffect(() => {
    if (!token) return
    socket.auth = (cb) => cb({ token })
    socket.connect()
  }, [token, socket])

  useEffect(() => {
    socket.onAny((event, ...args) => {
      console.log("SSS", event, args)
    })

    socket.on("connect", () => {
      console.log("connected", socket.id)
    })

    socket.on("disconnect", (reason) => {
      console.log("disconnected", reason)
    })

    return () => {
      // socket.removeAllListeners()
      socket.disconnect()
    }
  }, [socket])

  // prettier-ignore
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

// export type ExtendedSocketType = ReturnType<typeof io> | {
//   on: (eventName: string, cb: () => void) => void
// }
