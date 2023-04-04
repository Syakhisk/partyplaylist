import { RouterProvider } from "react-router-dom"
import { browserRouter } from "@/route/browserRouter"

const App = () => {
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
