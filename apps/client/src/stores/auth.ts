import { create } from "zustand"

export const useUserStore = create<userStore>(() => ({
  user: null,
}))

export interface userStore {
  user: User | null
}

type User = {
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
}
