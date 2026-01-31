"use client"
export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowser } from "@/lib/supabase-browser"

export default function LoginPage() {
  const router = useRouter()
  const supabase = getSupabaseBrowser()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  /**
   * 🔑 HARD FIX
   * Explicitly exchange email-confirmation token
   * Overrides cached / wrong sessions
   */
  useEffect(() => {
    const syncSessionFromUrl = async () => {
      const url = new URL(window.location.href)

      // Supabase may send ?code= after email confirm
      const code = url.searchParams.get("code")

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          console.error("Auth exchange failed:", error.message)
          setError("Login verification failed. Please try again.")
          return
        }

        router.replace("/inbox")
        return
      }

      // Fallback — already logged in
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.replace("/inbox")
      }
    }

    syncSessionFromUrl()
  }, [router, supabase])

  // 🌐 DOMAIN-AWARE BRANDING
  const isInbox =
    typeof window !== "undefined" &&
    window.location.hostname.includes("inboxae.com")

  const brand = isInbox
    ? {
        name: "ÆInbox",
        tagline: "Secure Email. Human-First.",
        accent: "text-emerald-400",
        border: "border-emerald-600",
        hover: "hover:bg-emerald-900",
      }
    : {
        name: "PoWERPiN",
        tagline: "Connected Intelligence",
        accent: "text-green-400",
        border: "border-green-700",
        hover: "hover:bg-green-900",
      }

  async function signIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push("/inbox")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black font-mono">
      <form
        onSubmit={signIn}
        className={`border ${brand.border} p-6 w-96 space-y-4`}
      >
        <h1 className={`text-lg ${brand.accent}`}>{brand.name}</h1>
        <p className="text-xs opacity-70">{brand.tagline}</p>

        <input
          className={`w-full bg-black border ${brand.border} p-2`}
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <input
          type="password"
          className={`w-full bg-black border ${brand.border} p-2`}
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error && <div className="text-red-400 text-sm">{error}</div>}

        <button
          disabled={loading}
          className={`w-full border ${brand.border} py-2 ${brand.hover}`}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  )
}
