import { SessionDetail } from "schema"
import { create } from "zustand"

export const useSessionStore = create<SessionDetail>(() => ({
  code: "",
  name: "",
  host: {
    uid: "",
    email: "",
    photoURL: "",
    displayName: "",
  },
}))

export const setSession = (store: SessionDetail) => useSessionStore.setState(store)
