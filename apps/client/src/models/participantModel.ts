import http from "@/lib/http"
import { useUserStore } from "@/stores/userStore"

const Participant = {
  kick: (code: string, uid: string) => http.delete(`/sessions/${code}/participants/${uid}`),
  leave: (code: string) => {
    const { user } = useUserStore.getState()
    if (!user) return
    return http.delete(`/sessions/${code}/participants/${user.uid}`)
  },
}

export default Participant
