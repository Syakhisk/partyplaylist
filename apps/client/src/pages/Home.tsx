import Button from "@/components/Button"
import { socket } from "@/constants"
import http from "@/lib/http"
import { useState } from "react"
import { ChevronUpIcon } from "@heroicons/react/24/outline"
import Form from "@/components/Form"
import { ChevronUpIcon } from "@heroicons/react/24/outline"
import { handleLogout } from "./Login/handler"
import { session, Session } from "schema"
import Input from "@/components/Input"

const Home = () => {
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

  function handleSubmit(data: Session.Join) {
    console.log(data)
  }

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto h-screen justify-center">
      <div className="border w-full max-w-sm rounded p-1 md:p-4 flex flex-col items-center justify-center">
        <h1 className="font-bold text-2xl text-center">🎷PartyPlaylist</h1>
        <p className="text-muted">Non-stop jams and good vibes</p>

        <div className="flex flex-col my-8 gap-4">
          <Form onSubmit={handleSubmit} zodSchema={session.join}>
            <Input placeholder="Session Name" id="name" />
            <Button type="submit">Join Session</Button>
          </Form>
        </div>
      </div>
    </div>
  )

  return (
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
  )
}

const LogoutButton = () => {
  return (
    <Button outlined onClick={handleLogout}>
      <div className="inline-flex">Logout</div>
    </Button>
  )
}

export default Home
