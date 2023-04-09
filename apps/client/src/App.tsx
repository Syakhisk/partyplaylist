import { RouterProvider } from "react-router-dom"
import { useEffect } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"

import { browserRouter } from "@/router/browserRouter"
import { login, useUserStore } from "@/stores/auth"
import { app } from "@/lib/firestore"
import { socket } from "@/constants"

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

  useEffect(() => {
    if (token) {
      socket.auth = (cb) => {
        cb({ token })
      }
      socket.connect()
    }
  }, [token])

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
