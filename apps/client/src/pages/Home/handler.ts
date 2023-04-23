import { OnSubmit } from "@/components/Form"
import { app } from "@/lib/firestore"
import Session from "@/models/sessionModel"
import { router } from "@/stores/routerStore"
import { getAuth } from "firebase/auth"
import { toast } from "react-toastify"
import { JoinSessionFormSchema } from "schema"

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

  router().navigate(`/listen/${res.data.code}`)
}

export const handleJoinSession: OnSubmit<JoinSessionFormSchema> = async (
  { code },
  { setError }
) => {
  const toastId = toast("Joining session...", { autoClose: false })

  const res = await Session.join(code)
  if (res.error) {
    const { status } = res.error

    if (status == 404) {
      toast.update(toastId, { render: "Session not found!", type: "error", autoClose: 2000 })
      setError("root", { message: "Session not found!" })
      return
    }

    toast.update(toastId, { render: "Failed to join session!", type: "error", autoClose: 2000 })
    return
  }

  toast.update(toastId, { render: "Session joined!", type: "success", autoClose: 2000 })
  router().navigate(`/listen/${code}`)
}
