import { API_BASE_URL } from "@/constants"
import { useUserStore } from "@/stores/userStore"
import { PropsWithChildren, useEffect, useState } from "react"
import { io } from "socket.io-client"
import { SocketContext } from "."

const SocketProvider = ({ children }: PropsWithChildren) => {
  const token = useUserStore((s) => s.token)
  const [socket] = useState(() =>
    io(API_BASE_URL, {
      autoConnect: false,
    })
  )

  const [status, setStatus] = useState<"idle" | "connected" | "disconnected">("idle")

  useEffect(() => {
    if (!token) return
    socket.auth = (cb) => cb({ token })
    socket.connect()
  }, [token, socket])

  useEffect(() => {
    socket.onAny((event, ...args) => {
      console.log(event, args)
    })

    socket.on("connect", () => {
      console.log("connected", socket.id)
      setStatus("connected")
    })

    socket.on("disconnect", (reason) => {
      console.log("disconnected", reason)
      setStatus("disconnected")
    })

    return () => {
      socket.removeAllListeners()
    }
  }, [socket])

  // prettier-ignore
  return (
    <SocketContext.Provider value={{socket, status}}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider
