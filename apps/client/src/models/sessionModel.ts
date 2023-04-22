import http from "@/lib/http"
import { CreatedSession, SessionDetail } from "schema"

const Session = {
  create: (name = "") => http.post<CreatedSession>("/sessions", { name }),
  join: (code: string) => http.post(`/sessions/${code}/join`),
  show: (code: string) => http.get<SessionDetail>(`/sessions/${code}`),
  end: (code: string) => http.delete(`/sessions/${code}`),
}

export default Session
