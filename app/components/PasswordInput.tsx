"use client"

import { useState } from "react"

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Password",
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [show, setShow] = useState(false)

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="current-password"
        style={{
          width: "100%",
          padding: "14px 44px 14px 14px",
          borderRadius: 10,
          border: "1px solid #1f2937",
          background: "#0b0f14",
          color: "#ffffff",
          fontSize: 16,
          outline: "none",
        }}
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        aria-label={show ? "Hide password" : "Show password"}
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 18,
          color: "#00ffa3",
        }}
      >
        {show ? "🙈" : "👁️"}
      </button>
    </div>
  )
}
