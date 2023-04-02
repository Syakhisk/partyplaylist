import { createBrowserRouter } from "react-router-dom"
import Home from "@/pages/Home"
import NotFound from "./components/NotFound"

// https://github.com/microsoft/TypeScript/issues/47663
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
])
