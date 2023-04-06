import Button from "@/components/Button"
import { initializeApp } from "firebase/app"
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  User,
} from "firebase/auth"
import { useEffect, useState } from "react"

const firebaseConfig = {
  apiKey: "AIzaSyDX2YZ_NolrWUaagYRaPaEkg1YYS0BngJQ",
  authDomain: "personal-projects-00.firebaseapp.com",
  projectId: "personal-projects-00",
  storageBucket: "personal-projects-00.appspot.com",
  messagingSenderId: "765797876296",
  appId: "1:765797876296:web:7697ec245194b7c3bb4e7d",
  measurementId: "G-PW36N5FCRZ",
}

const Login = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [user, setUser] = useState<User>()

  useEffect(() => {
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)

    const unsub = onAuthStateChanged(auth, (_user) => {
      if (_user) {
        setIsLogin(true)
        setUser(_user)
      } else {
        setIsLogin(false)
        setUser(undefined)
      }
    })

    return () => unsub()
  }, [])

  // TODO: refactor
  const handleLogin = async () => {
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)

    const creds = await signInWithPopup(auth, new GoogleAuthProvider())
    const idToken = await creds.user.getIdToken()

    const res = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ uid: creds.user.uid }),
    }).catch((err) => console.log(err))

    console.log(await res?.json())
  }

  const handleLogout = async () => {
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)

    await auth.signOut()
  }

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto h-screen justify-center">
      <div className="border w-full max-w-sm rounded p-1 md:p-4 flex flex-col items-center justify-center">
        <h1 className="font-bold text-2xl text-center">🎷PartyPlaylist</h1>
        <p className="text-muted">Non-stop jams and good vibes</p>

        {isLogin ? <div>{user?.displayName}</div> : <div>Not logged in</div>}

        {user ? (
          <Button outlined className="my-8" onClick={handleLogout}>
            <div className="inline-flex">Logout</div>
          </Button>
        ) : (
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
        )}
      </div>
    </div>
  )
}

export default Login
