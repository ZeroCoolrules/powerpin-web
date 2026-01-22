"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function signIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // ✅ CREATE SUPABASE CLIENT AT RUNTIME (NOT AT BUILD)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-green-400 font-mono">
      <form
        onSubmit={signIn}
        className="border border-green-700 p-6 w-96 space-y-4"
      >
        <h1 className="text-lg">PoWERPiN Login</h1>

        <input
          className="w-full bg-black border border-green-700 p-2"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full bg-black border border-green-700 p-2"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="text-red-400">{error}</div>}

        <button
          disabled={loading}
          className="w-full border border-green-700 py-2 hover:bg-green-900"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  )
}
