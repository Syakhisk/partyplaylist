import { RouterProvider } from "react-router-dom"
import { useEffect } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"

import { browserRouter } from "@/router/browserRouter"
import { login, useUserStore } from "@/stores/auth"
import { app } from "@/lib/firestore"
import { socket } from "./lib/socket"
import { io } from "socket.io-client"
import { WS_BASE_URL } from "./constants"

/**
 * Global listener, such as auth,
 * should be placed in this component.
 */
const App = () => {
  const token = useUserStore((s) => s.token)
  useEffect(() => {
    const auth = getAuth(app)
    const unsubscribe = onAuthStateChanged(auth, login)

    return unsubscribe
  }, [])

  // TODO: refactor
  useEffect(() => {
    if (!token) return
    io(WS_BASE_URL, {
      auth: {
        token,
      },
      reconnection: true,
      autoConnect: true,
    })

    // socket.auth = (cb) => {
    //   cb({ token })
    // }

    // socket.connect()
  }, [token])

  // TODO: refactor
  useEffect(() => {
    socket.onAny((event, ...args) => {
      console.log(event, args)
    })

    socket.on("connect", () => {
      console.log("connected", socket.id)
    })

    socket.on("disconnect", (reason) => {
      console.log("disconnected", reason)
    })

    socket.on("reconnect", (attemptNumber) => {
      console.log("reconnect", attemptNumber)
    })

    return () => {
      socket.removeAllListeners()
    }
  }, [])

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
