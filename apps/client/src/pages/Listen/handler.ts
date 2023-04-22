import Participant from "@/models/participants"
import Session from "@/models/session"
import { browserRouter } from "@/router/browserRouter"
import { toast } from "react-toastify"

export const handleGetDetail = async (code: string) => {
  const res = await Session.show(code)

  if (res.error) {
    const { status } = res.error

    if (status === 404) {
      browserRouter.navigate("/404")
      toast.error("Session not found")
    }

    return
  }

  return res.data
}

export const handleLeaveSession = async (code: string) => {
  const res = await Participant.leave(code)
  if (res?.error) {
    toast.error("Failed to leave session")
    return
  }

  toast.success("You have left the session")
  browserRouter.navigate("/")
}
