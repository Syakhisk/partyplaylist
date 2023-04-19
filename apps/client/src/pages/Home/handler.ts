import { app } from "@/lib/firestore"
import { getAuth } from "firebase/auth"

export const handleLogout = async () => {
  const auth = getAuth(app)
  await auth.signOut()
}
