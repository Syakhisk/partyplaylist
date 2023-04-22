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
  if (res.error) {
    toast.update(toastId, { render: "Failed to create session!", type: "error", autoClose: 2000 })
    return
  }

  toast.update(toastId, { render: "Session created!", type: "success", autoClose: 2000 })

  browserRouter.navigate(`/listen/${res.data.code}`)
}

export const handleJoinSession = async ({ code }: { code: string }) => {
  const toastId = toast("Joining session...", { autoClose: false })

  const res = await Session.join(code)
  if (res.error) return

  toast.update(toastId, { render: "Session joined!", type: "success", autoClose: 2000 })

  browserRouter.navigate(`/listen/${code}`)
}
