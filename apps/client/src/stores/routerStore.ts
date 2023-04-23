import { NavigateFunction } from "react-router-dom"
import { create } from "zustand"

export const useRouterStore = create<RouterStore>(() => ({
  navigate: () => null,
}))

export const router = useRouterStore.getState

interface RouterStore {
  navigate: NavigateFunction
}
