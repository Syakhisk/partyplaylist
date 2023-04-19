import { createBrowserRouter } from "react-router-dom"
import { RouteGuard } from "./routeGuard"
import routes from "./routes"

export const browserRouter: BrowserRouterReturnType = createBrowserRouter(
  routes.map((route) => {
    const { component: Component, ...opts } = route

    return {
      ...opts,
      element: (
        <RouteGuard isPublic={opts.isPublic}>
          <Component />
        </RouteGuard>
      ),
    }
  })
)

type BrowserRouterReturnType = ReturnType<typeof createBrowserRouter>
