import AuthLoading from "@/components/AuthLoading"
import { useUserStore } from "@/stores/auth"
import { PropsWithChildren, useEffect } from "react"
import { createBrowserRouter, useLocation, useNavigate } from "react-router-dom"
import routes from "./routes"

/**
 * Wrapper component for all routes.
 * This component is used to check if the user is logged in.
 * If the user visits a private route without being logged in,
 * they will be redirected to the login page.
 */
const Wrapper = ({ children, isPublic }: PropsWithChildren<{ isPublic?: boolean }>) => {
  const navigate = useNavigate()
  const location = useLocation()
  const token = useUserStore((state) => state.token)
  const authLoading = useUserStore((state) => state.authLoading)

  useEffect(() => {
    if (authLoading) return

    if (!isPublic && !token) navigate("/login")
    if (location.pathname === "/login" && token) navigate("/")
  }, [navigate, isPublic, token, location, authLoading])

  if (authLoading) {
    return <AuthLoading />
  }

  return (
    <div>
      <div>{children}</div>
    </div>
  )
}

export const browserRouter = createBrowserRouter(
  routes.map((route) => {
    const { component: Component, ...opts } = route

    return {
      ...opts,
      element: (
        <Wrapper isPublic={opts.isPublic}>
          <Component />
        </Wrapper>
      ),
    }
  })
)
