import Button from "@/components/Button"
import { ChevronUpIcon } from "@heroicons/react/24/outline"

const Home = () => {
  return (
    <div className="flex">
      <Button variant="primary" disabled>Hello</Button>
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

export default Home
