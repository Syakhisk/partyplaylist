import { app } from "@/lib/firestore"
import http from "@/lib/http"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"

export const handleLogin = async () => {
  const auth = getAuth(app)
  const creds = await signInWithPopup(auth, new GoogleAuthProvider())

  await http.post("/users", {
    uid: creds.user.uid,
  })
}

export const handleLogout = async () => {
  const auth = getAuth(app)
  await auth.signOut()
}
