"use client"

import { useState, useEffect } from "react"
import { supabaseBrowser } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LoginPage() {
  const supabase = supabaseBrowser()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isRecovery, setIsRecovery] = useState(false)
  const [checkedSession, setCheckedSession] = useState(false)

  useEffect(() => {
    const hash = window.location.hash

    const recovery = hash.includes("type=recovery")
    const expired = hash.includes("error=access_denied")

    if (recovery) {
      setIsRecovery(true)
    }

    if (expired) {
      setError("Reset link expired. Please request a new password reset.")
    }

    // Only auto-redirect if NOT recovery
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && !recovery) {
        router.push("/aeinbox/inbox")
      } else {
        setCheckedSession(true)
      }
    })

    // Clean hash from URL after processing
    if (hash) {
      window.history.replaceState(null, "", window.location.pathname)
    }
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
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

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/aeinbox/inbox")
  }

  if (!checkedSession) return null

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
        onSubmit={isRecovery ? handlePasswordUpdate : handleLogin}
        className="w-full max-w-md bg-[#0F172A]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,229,255,0.08)]"
      >
        <div className="space-y-4">

          {!isRecovery && (
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 focus:border-cyan-400 outline-none transition"
            />
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={isRecovery ? "New password" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 focus:border-cyan-400 outline-none transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {!isRecovery && (
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                Forgot password?
              </a>
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold transition bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20"
          >
            {loading
              ? "Processing…"
              : isRecovery
              ? "Update Password"
              : "Sign in"}
          </button>

        </div>
      </form>

      <div className="absolute bottom-6 text-xs text-gray-600">
        <br>Part of the AEmail Intelligence Network
      </div>
    </main>
  )
}