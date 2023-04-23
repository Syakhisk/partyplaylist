import Participant from "@/models/participantModel"
import Session from "@/models/sessionModel"
import { router } from "@/stores/routerStore"
import { setSession, useSessionStore } from "@/stores/sessionStore"
import { useUserStore } from "@/stores/userStore"
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

  setSession(res.data)
  return res.data
}

export const handleLeaveSession = async () => {
  const { host, code } = useSessionStore.getState()
  const { user } = useUserStore.getState()

  const isHost = host?.uid === user?.uid

  const res = isHost ? await Session.end(code) : await Participant.leave(code)

  if (res?.error) {
    toast.error("Failed to leave session")
    return
  }

  toast.success("You have left the session")
  router().navigate("/")
}
