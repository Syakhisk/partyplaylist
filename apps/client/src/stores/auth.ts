import { User } from "firebase/auth"
import { create } from "zustand"

export const useUserStore = create<userStore>(() => ({
  user: null,
  token: null,
  authLoading: true,
}))

export const setUser = async (user: User | null) => {
  useUserStore.setState({ user })
}

export const setToken = async (token: string | null) => {
  useUserStore.setState({ token })
}

export const login = async (user: User | null) => {
  const token = (await user?.getIdToken()) || null

  setUser(user)
  setToken(token)

  useUserStore.setState({ authLoading: false })
}

export const getToken = () => {
  return useUserStore.getState().token
}

export interface userStore {
  user: User | null
  token: string | null
  authLoading: boolean
}
