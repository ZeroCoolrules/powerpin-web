"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowser } from "@/lib/supabase-browser"

export default function RegisterPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const passwordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)

  async function register(e: React.FormEvent) {
    e.preventDefault()
    if (!passwordValid || loading) return

    setLoading(true)
    setError(null)

    const supabase = getSupabaseBrowser()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://inboxae.com/login",
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push("/register/check-email")
  }

  return (
    <form onSubmit={register}>
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="email"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="password"
      />
      {error && <p>{error}</p>}
      <button disabled={!passwordValid || loading}>
        Create account
      </button>
    </form>
  )
}
