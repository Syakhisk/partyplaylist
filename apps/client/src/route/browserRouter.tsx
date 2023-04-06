import { PropsWithChildren, useEffect } from "react"
import { createBrowserRouter, useNavigate } from "react-router-dom"
import routes from "./routes"

const Wrapper = ({ children, isPublic }: PropsWithChildren<{ isPublic?: boolean }>) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isPublic) {
      navigate("/login")
    }
  }, [navigate, isPublic])

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
