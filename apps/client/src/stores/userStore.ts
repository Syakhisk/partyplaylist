import { User } from "firebase/auth"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useUserStore = create<userStore>()(
  persist(
    (_set) => ({
      user: null,
      token: null,
      authLoading: true,
    }),
    {
      name: "user-store",
    }
  )
)

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

// TODO: remove this, use useUserStore.getState().token instead
export const getToken = () => {
  return useUserStore.getState().token
}

export interface userStore {
  user: User | null
  token: string | null
  authLoading: boolean
}
