import Button from "@/components/Button"
import Form from "@/components/Form"
import Input from "@/components/Input"
import { useNavigate } from "react-router-dom"
import { handleLogout } from "./handler"
import { useEffect } from "react"
import http from "@/lib/http"
import { useUserStore } from "@/stores/auth"
import { createSession, CreateSession } from "schema"

const Home = () => {
  const navigate = useNavigate()
  const token = useUserStore((s) => s.token)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
      // if (!token) return
      // const session = await http.get("/sessions/me")
      // console.log(session)
    })()
  }, [token])

  function handleSubmit(data: CreateSession) {
    console.log(data)
  }

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto h-screen justify-center">
      <div className="border w-full max-w-sm rounded p-1 md:p-4 flex flex-col items-center justify-center">
        <h1 className="font-bold text-2xl text-center">🎷PartyPlaylist</h1>
        <p className="text-muted">Non-stop jams and good vibes</p>

        <div className="flex flex-col my-8 gap-4">
          <Form onSubmit={handleSubmit} zodSchema={createSession}>
            <Button type="submit">Create a Session</Button>
          </Form>
        </div>
      </div>

      <div>
        <Button outlined onClick={() => navigate("/kitchensink")}>
          Logout
        </Button>

        <Button outlined onClick={() => navigate("/kitchensink")}>
          Go to kitchensink
        </Button>
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
