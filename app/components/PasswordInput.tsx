"use client"

import { useState } from "react"

type Props = {
  value: string
  onChange: (value: string) => void
}

export default function PasswordInput({ value, onChange }: Props) {
  const [show, setShow] = useState(false)

  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Password"
        style={{
          width: "100%",
          padding: "14px 44px 14px 14px",
          background: "transparent",
          border: "1px solid #00ffa3",
          borderRadius: 10,
          color: "#fff",
          fontSize: 16,
        }}
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          color: "#00ffa3",
          cursor: "pointer",
          fontSize: 14,
        }}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? "🙈" : "👁"}
      </button>
    </div>
  )
}
