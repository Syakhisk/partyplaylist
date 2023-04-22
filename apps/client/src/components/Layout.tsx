import { useSocket } from "@/lib/socket"
import clsx from "clsx"
import { PropsWithChildren } from "react"

const Layout = ({ children }: PropsWithChildren) => {
  const { status } = useSocket()

  const barCN = clsx("h-0.5 w-full bg-gray-500 cursor-pointer absolute inset-0", {
    "bg-green-500": status === "connected",
    "bg-red-500": status === "disconnected",
  })

  return (
    <div className="flex flex-col">
      <div className={barCN} title={`Websocket status: ${status.toUpperCase()}`} />
      {children}
    </div>
  )
}

export default Layout
