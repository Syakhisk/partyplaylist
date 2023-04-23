import Loading from "@/components/Loading"
import { useRouterStore } from "@/stores/routerStore"
import { useUserStore } from "@/stores/userStore"
import { PropsWithChildren, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

/**
 * Wrapper component for all routes.
 * This component is used to check if the user is logged in.
 * If the user visits a private route without being logged in,
 * they will be redirected to the login page.
 */
export const RouteGuard = ({ children, isPublic }: PropsWithChildren<{ isPublic?: boolean }>) => {
  const navigate = useNavigate()
  const location = useLocation()
  const token = useUserStore((state) => state.token)
  const authLoading = useUserStore((state) => state.authLoading)

  // Set the navigate function in the routerStore
  // since we can't use the navigate function from react-router-dom
  // outside of the react component.
  useEffect(() => {
    useRouterStore.setState({ navigate })
  }, [navigate])

  useEffect(() => {
    if (authLoading) return

    if (!isPublic && !token) navigate("/login")
    if (location.pathname === "/login" && token) navigate("/")
  }, [navigate, isPublic, token, location, authLoading])

  if (authLoading) {
    return <Loading />
  }

  return <>{children}</>
}
