import { RouterProvider } from "react-router-dom"
import { useEffect } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"

import { browserRouter } from "@/router/browserRouter"
import { getToken, login } from "@/stores/auth"
import { app } from "@/lib/firestore"
import { socket } from "@/constants"

const App = () => {
  const token = getToken()
  useEffect(() => {
    const auth = getAuth(app)
    const unsubscribe = onAuthStateChanged(auth, login)

    return unsubscribe
  }, [])

  useEffect(() => {
    if (!token) return
    socket.auth = () => token
    socket.connect()
  }, [token])

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
