"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function ResetPasswordForm() {
  const supabase = createClientComponentClient()
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleReset = async () => {
    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password
    })

    if (error) {
      alert(error.message)
    } else {
      alert("Password updated successfully")
      window.location.href = "/aeinbox/inbox"
    }

    setLoading(false)
  }

  return (
    <div>
      <h2>Set New Password</h2>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleReset} disabled={loading}>
        Update Password
      </button>
    </div>
  )
}