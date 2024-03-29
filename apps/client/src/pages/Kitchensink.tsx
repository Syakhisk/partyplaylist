import Layout from "@/components/Layout"
import Button from "@/components/Button"
import http from "@/lib/http"
import { useSocket } from "@/lib/socket"
import { useState } from "react"
import { handleLogout } from "./Login/handler"

const Kitchensink = () => {
  const { socket } = useSocket()
  const [code, setCode] = useState("")
  const [session, setSession] = useState({})
  const [error, setError] = useState<unknown>(null)
  const [me, setMe] = useState<unknown>(null)

  const handleCreateSession = async () => {
    const res = await http
      .post("/sessions", {
        name: "udin",
      })
      .catch((e) => setError({ msg: e.msg, data: e.response?.data }))

    setSession(res?.data)
  }

  const handleJoinSession = async () => {
    const res = await http
      .post(`/sessions/${code}/join`)
      .catch((e) => setError({ msg: e.msg, data: e.response?.data }))

    setSession(res?.data)
  }

  const handleMe = async () => {
    const res = await http
      .get("/sessions/me")
      .catch((e) => setError({ msg: e.msg, data: e.response?.data }))

    setMe(res?.data)
  }

  const handleConnect = async () => {
    if (socket.connected) {
      console.log("connected already")
      return
    }
    socket.connect()
  }

  const handleDisconnect = async () => {
    if (socket.disconnected) {
      console.log("disconnected already")
      return
    }
    socket.disconnect()
  }

  return (
    <Layout>
      <div className="flex flex-col gap-3">
        <Button onClick={handleCreateSession}>Create Session</Button>
        <div>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} />
          <Button onClick={handleJoinSession}>Join Session</Button>
        </div>
        <Button onClick={handleMe}>Me</Button>
        <Button onClick={handleConnect}>Connect</Button>
        <Button onClick={handleDisconnect}>Disconnect</Button>

        <LogoutButton />

        <div>
          <div>{JSON.stringify({ session })}</div>
          <div>{JSON.stringify({ error })}</div>
          <pre>{JSON.stringify({ me }, null, 2)}</pre>
        </div>
      </div>
    </Layout>
  )
}

const LogoutButton = () => {
  return (
    <Button outlined onClick={handleLogout}>
      <div className="inline-flex">Logout</div>
    </Button>
  )
}

export default Kitchensink
