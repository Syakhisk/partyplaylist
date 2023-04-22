import { app } from "@/lib/firestore"
import Session from "@/models/session"
import { browserRouter } from "@/router/browserRouter"
import { getAuth } from "firebase/auth"

export const handleLogout = async () => {
  const auth = getAuth(app)
  await auth.signOut()
}

export const handleCreateSession = async () => {
  const res = await Session.create()
  if (res.error) return

  browserRouter.navigate(`/listen/${res.data.code}`)
}
