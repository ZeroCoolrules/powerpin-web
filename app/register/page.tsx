"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import PasswordInput from "../components/PasswordInput"
import { supabaseBrowser } from "@/lib/supabase-browser"

export default function RegisterPage() {
  const router = useRouter()
  const supabase = supabaseBrowser()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const passwordValid = useMemo(
    () =>
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password),
    [password]
  )

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!passwordValid || loading) return

    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)

    if (error) return setError(error.message)

    router.push("/register/check-email")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleRegister} className="w-[420px] p-8 rounded-2xl bg-[#0f1720]">
        <Image src="/aeinbox-wordmark.png" alt="ÆInbox" width={300} height={70} />

        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-4 p-3 bg-black border rounded"
        />

        <PasswordInput value={password} onChange={setPassword} />

        {error && <div className="text-red-400 text-sm mt-2">{error}</div>}

        <button
          disabled={!passwordValid || loading}
          className="w-full mt-6 p-3 bg-green-400 text-black rounded-full"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </div>
  )
}
