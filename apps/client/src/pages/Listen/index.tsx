import Button from "@/components/Button"
import Layout from "@/components/Layout"
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { handleGetDetail, handleLeaveSession } from "./handler"

const Listen = () => {
  const { code } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
      if (!code) return navigate("/")
      handleGetDetail(code)
      setLoading(false)
    })()
  }, [code, navigate])

  if (loading || !code) return <Loading />

  return (
    <Layout>
      <div className="grid border-t border-b text-sm font-mono">
        <div className="text-xs">Session Code:</div>
        <div className="col-span-2 bg-gray-700 p-0.5">#{code}</div>
      </div>

      <div>
        <Button onClick={handleLeaveSession}>Leave Session</Button>
      </div>
    </Layout>
  )
}

export default Listen
