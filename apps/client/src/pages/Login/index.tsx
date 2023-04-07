import Button from "@/components/Button"
import { handleLogin } from "./handler"

const Login = () => {
  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto h-screen justify-center">
      <div className="border w-full max-w-sm rounded p-1 md:p-4 flex flex-col items-center justify-center">
        <h1 className="font-bold text-2xl text-center">🎷PartyPlaylist</h1>
        <p className="text-muted">Non-stop jams and good vibes</p>

        <Button outlined className="my-8" onClick={handleLogin}>
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="inline-flex h-5 w-5 mr-2"
          >
            <title>Google</title>
            <path
              fill="currentColor"
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            />
          </svg>
          <div className="inline-flex">Login with Google</div>
        </Button>
      </div>
    </div>
  )
}

export default Login
