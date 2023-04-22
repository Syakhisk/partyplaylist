import Button from "@/components/Button"
import { useNavigate } from "react-router-dom"
import { handleCreateSession, handleJoinSession } from "./handler"
import Layout from "@/components/Layout"
import Form from "@/components/Form"
import { joinSessionFormSchema } from "schema"
import Input from "@/components/Input"

const Home = () => {
  const navigate = useNavigate()

  return (
    <Layout>
      <div className="flex flex-col gap-4 h-screen justify-center items-center">
        <div className="border max-w-sm w-full rounded p-1 md:p-4 flex flex-col items-center justify-center">
          <h1 className="font-bold text-2xl text-center">🎷PartyPlaylist</h1>
          <p className="text-muted">Non-stop jams and good vibes</p>

          <div className="flex flex-col my-8 gap-4 w-full">
            <Form
              zodSchema={joinSessionFormSchema}
              onSubmit={handleJoinSession}
              className="flex flex-col gap-4"
            >
              <Input id="code" />
              <Button type="submit">Join a Session</Button>
            </Form>
            <Button variant="borderless-primary" onClick={handleCreateSession}>
              Create a Session
            </Button>
          </div>
        </div>

        <div>
          <Button variant="outline-primary" onClick={() => navigate("/kitchensink")}>
            Go to kitchensink
          </Button>
        </div>
      </div>
    </Layout>
  )
}

export default Home
