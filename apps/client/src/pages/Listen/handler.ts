import Participant from "@/models/participantModel"
import Session from "@/models/sessionModel"
import { router } from "@/stores/routerStore"
import { setSession, useSessionStore } from "@/stores/sessionStore"
import { useUserStore } from "@/stores/userStore"
import { toast } from "react-toastify"

export const handleGetDetail = async (code: string) => {
  const res = await Session.show(code)

  if (res.error) {
    const { status, message } = res.error

    switch (status) {
      case 404:
        router().navigate("/404")
        toast.error("Session not found")
        break

      case 403:
        if(typeof message === 'string') {
          toast.error(message)
        }

        else if(message.type === "NOT_IN_SESSION") {
          // join session modal
        }

        else if(message.type === "JOINED_ANOTHER_SESSION") {
          // redirect to current session?
        }

      break

      default:
        break
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
