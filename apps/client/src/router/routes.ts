import Home from "@/pages/Home"
import NotFound from "@/components/NotFound"
import Public from "@/pages/Public"
import Login from "@/pages/Login"
import Private from "@/pages/Private"

const routes = [
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
