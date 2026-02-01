"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg("Submitting…")

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      console.error(error)
      setMsg("ERROR: " + error.message)
      return
    }

    console.log("SIGNED UP:", data)
    setMsg("SUCCESS — check Supabase users table")
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>RAW REGISTER TEST</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">REGISTER</button>
      </form>

      <pre>{msg}</pre>
    </div>
  )
}
