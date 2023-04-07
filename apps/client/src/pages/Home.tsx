import Button from "@/components/Button"
import { ChevronUpIcon } from "@heroicons/react/24/outline"
import { handleLogout } from "./Login/handler"

const Home = () => {
  return (
    <div className="flex">
      <LogoutButton />
      <Button variant="primary" disabled>
        Hello
      </Button>
      <Button variant="warning">Hello</Button>
      <Button variant="secondary">Hello</Button>

      <Button variant="primary" outlined>
        Hello
      </Button>
      <Button variant="warning" outlined>
        Hello
      </Button>
      <Button variant="secondary" outlined>
        Hello
      </Button>

      <Button Icon={ChevronUpIcon} variant="primary" />
      <Button Icon={ChevronUpIcon} variant="warning" />
      <Button Icon={ChevronUpIcon} variant="secondary" />
    </div>
  )
}

const LogoutButton = () => {
  return (
    <Button outlined className="my-8" onClick={handleLogout}>
      <div className="inline-flex">Logout</div>
    </Button>
  )
}

export default Home
