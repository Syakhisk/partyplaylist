import Button from "@/components/Button"
import { useNavigate } from "react-router-dom"
import { handleCreateSession, handleLogout } from "./handler"
import { useEffect } from "react"
import { useUserStore } from "@/stores/userStore"
import Layout from "@/components/Layout"

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

  return (
    <Layout>
      <div className="flex flex-col gap-4 max-w-sm mx-auto h-screen justify-center">
        <div className="border w-full max-w-sm rounded p-1 md:p-4 flex flex-col items-center justify-center">
          <h1 className="font-bold text-2xl text-center">🎷PartyPlaylist</h1>
          <p className="text-muted">Non-stop jams and good vibes</p>

          <div className="flex flex-col my-8 gap-4">
            <Button onClick={handleCreateSession}>Create a Session</Button>
          </div>
        </div>

        <div>
          <Button outlined onClick={() => navigate("/kitchensink")}>
            Go to kitchensink
          </Button>
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

export default Home
