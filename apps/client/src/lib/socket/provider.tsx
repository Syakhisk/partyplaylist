import { API_BASE_URL } from "@/constants"
import { useUserStore } from "@/stores/auth"
import { PropsWithChildren, useEffect, useState } from "react"
import { io } from "socket.io-client"
import { SocketContext } from "."

const SocketProvider = ({ children }: PropsWithChildren) => {
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

export default SocketProvider