"use client"

import { use, useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import GatewayAgent from "@/app/components/GatewayAgent"

export default function GatewayPage({
  params,
}: {
  params: Promise<{ artifact_id: string }>
}) {
  // ✅ Unwrap params correctly (Next.js 15+)
  const { artifact_id } = use(params)

  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    supabase.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) {
        setError("Not authenticated")
        return
      }
	console.log("User JWT OK:", data.session.user.id)

      setAccessToken(data.session.access_token)
    })
  }, [])

  if (error) {
    return <div className="p-6 text-red-400">{error}</div>
  }

  if (!accessToken) {
    return (
      <div className="p-6 font-mono text-yellow-400">
        Checking authentication…
      </div>
    )
  }
	

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Gateway</h1>
      <GatewayAgent
        artifactId={artifact_id}
        accessToken={accessToken}
      />
    </div>
  )
}
