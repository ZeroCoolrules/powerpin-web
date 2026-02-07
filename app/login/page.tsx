"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabaseBrowser } from "@/lib/supabase-browser"

export default function LoginPage() {
  const router = useRouter()
  const supabase = supabaseBrowser()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/aeinbox")
    })
  }, [router, supabase])

  async function signIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)
    if (error) return setError(error.message)

    router.push("/aeinbox")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={signIn} className="w-[420px] p-8 rounded-2xl bg-[#0f1720]">
        <h2 className="mb-4">Sign in</h2>

        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-3 bg-black border rounded"
        />

        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-3 bg-black border rounded"
        />

        {error && <div className="text-red-400 text-sm mb-2">{error}</div>}

        <button disabled={loading} className="w-full p-3 bg-green-400 text-black rounded-full">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  )
}
