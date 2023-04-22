import { app } from "@/lib/firestore"
import Session from "@/models/sessionModel"
import { browserRouter } from "@/router/browserRouter"
import { getAuth } from "firebase/auth"
import { toast } from "react-toastify"

export const handleLogout = async () => {
  const auth = getAuth(app)
  await auth.signOut()
}

export const handleCreateSession = async () => {
  const toastId = toast("Creating session...", { autoClose: false })

  const res = await Session.create()
  if (res.error) return

  toast.update(toastId, { render: "Session created!", type: "success", autoClose: 2000 })

  browserRouter.navigate(`/listen/${res.data.code}`)
}
