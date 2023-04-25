import { GetSessionDetail } from "schema"
import { create } from "zustand"

export const useSessionStore = create<GetSessionDetail>(() => ({
  code: "",
  name: "",
  host: {
    uid: "",
    email: "",
    photoURL: "",
    displayName: "",
  },
}))

export const setSession = (store: GetSessionDetail) => useSessionStore.setState(store)
