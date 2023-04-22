import { RouterProvider } from "react-router-dom"
import { useEffect } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { browserRouter } from "@/router/browserRouter"
import { login } from "@/stores/auth"
import { app } from "@/lib/firestore"
import SocketProvider from "./lib/socket/provider"
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from "react-toastify"

/**
 * Global listener, such as auth,
 * should be placed in this component.
 */
const App = () => {
  useEffect(() => {
    const auth = getAuth(app)
    const unsubscribe = onAuthStateChanged(auth, login)

    return unsubscribe
  }, [])

  return (
    <>
      <SocketProvider>
        <RouterProvider router={browserRouter} />
        <ToastContainer />
      </SocketProvider>
    </>
  )
}

export default App
