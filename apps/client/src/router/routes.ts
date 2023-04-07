import Home from "@/pages/Home"
import NotFound from "@/components/NotFound"
import Public from "@/pages/Public"
import Login from "@/pages/Login"
import Private from "@/pages/Private"
import { RouteObject } from "react-router-dom"

type AugmentedRouteObject = RouteObject & {
  isPublic?: boolean
  component: () => JSX.Element
}

const routes: AugmentedRouteObject[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/private",
    component: Private,
  },
  {
    path: "/login",
    component: Login,
    isPublic: true,
  },
  {
    path: "/public",
    component: Public,
    isPublic: true,
  },
  {
    path: "*",
    component: NotFound,
  },
]

export default routes
