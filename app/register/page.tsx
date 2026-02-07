"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowser } from "@/lib/supabase-browser"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const passwordValid = useMemo(() => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    )
  }, [password])

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!passwordValid || loading) return

    setLoading(true)
    setError(null)

    const supabase = getSupabaseBrowser()
    const { error } = await supabase.auth.signUp({ email, password })

    setLoading(false)
    if (error) return setError(error.message)

    router.push("/register/check-email")
  }

  return (
    <form onSubmit={handleRegister}>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      {error && <div>{error}</div>}
      <button disabled={!passwordValid || loading}>Create account</button>
    </form>
  )
}
