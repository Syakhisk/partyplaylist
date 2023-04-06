import { create } from "zustand"

export const useUserStore = create<userStore>(() => ({
  user: null,
}))

export interface userStore {
  user: Player | null
}

type Player = {
  playVideo: () => void
  stopVideo: () => void
  pauseVideo: () => void
}
