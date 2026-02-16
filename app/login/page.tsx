"use client"

import { useState, useMemo } from "react"
import { supabaseBrowser } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { validatePassword, isPasswordValid } from "@/lib/passwordRules"

export default function LoginPage() {
  const supabase = supabaseBrowser()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const rules = useMemo(() => validatePassword(password), [password])
  const passwordValid = useMemo(() => isPasswordValid(password), [password])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    if (!passwordValid) {
      setError("Password does not meet security requirements.")
      return
    }

    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError("Invalid email or password.")
      setLoading(false)
      return
    }

    router.push("/aeinbox/inbox")
  }

  return (
    <main className="relative min-h-screen bg-[#0A0F1E] text-white flex flex-col items-center justify-center overflow-hidden">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.06),transparent_70%)] pointer-events-none" />

      <div className="mb-10">
        <Image
          src="/aemail-wordmark.png"
          alt="AEmail"
          width={160}
          height={40}
          priority
        />
      </div>

      <div className="text-center mb-10 px-6 max-w-xl">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
          Private email.
          <br />
          <span className="text-cyan-400">
            Built with intelligence.
          </span>
        </h1>

        <p className="mt-4 text-gray-400 text-sm md:text-base">
          No ads. No surveillance. Just signal.
        </p>
      </div>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-[#0F172A]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,229,255,0.08)]"
      >
        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 focus:border-cyan-400 outline-none transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 focus:border-cyan-400 outline-none transition"
          />

          {/* Password Rules */}
          <ul className="text-xs space-y-1">
            <li className={rules.length ? "text-green-400" : "text-gray-500"}>
              • At least 8 characters
            </li>
            <li className={rules.upper ? "text-green-400" : "text-gray-500"}>
              • Uppercase letter
            </li>
            <li className={rules.lower ? "text-green-400" : "text-gray-500"}>
              • Lowercase letter
            </li>
            <li className={rules.number ? "text-green-400" : "text-gray-500"}>
              • Number
            </li>
            <li className={rules.special ? "text-green-400" : "text-gray-500"}>
              • Special character
            </li>
          </ul>

          {error && (
            <div className="text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!passwordValid || loading}
            className={`w-full py-3 rounded-xl font-semibold transition shadow-lg ${
              passwordValid
                ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

        </div>
      </form>

      <div className="absolute bottom-6 text-xs text-gray-600">
        Part of the AEmail Intelligence Network
      </div>
    </main>
  )
}
