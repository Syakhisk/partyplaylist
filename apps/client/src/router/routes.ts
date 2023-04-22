import Home from "@/pages/Home"
import NotFound from "@/components/NotFound"
import Public from "@/pages/Public"
import Login from "@/pages/Login"
import Private from "@/pages/Private"
import { RouteObject } from "react-router-dom"
import Kitchensink from "@/pages/Kitchensink"
import Listen from "@/pages/Listen"

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
    path: "/kitchensink",
    component: Kitchensink,
  },
  {
    path: "/login",
    component: Login,
    isPublic: true,
  },
  {
    path: "/listen/:code?",
    component: Listen,
  },
  {
    path: "/404",
    component: NotFound,
  },
  {
    path: "*",
    component: NotFound,
  },
]

export default routes
