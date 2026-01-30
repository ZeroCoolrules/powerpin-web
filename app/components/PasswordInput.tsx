"use client"

import { useState } from "react"

export default function PasswordInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  const [show, setShow] = useState(false)

  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}  // 🔥 THIS WAS MISSING
        style={{
          width: "100%",
          padding: "14px 44px 14px 14px",
          background: "transparent",
          border: "1px solid #00ffa3",
          borderRadius: 10,
          color: "#fff",
          fontSize: 16,
          outline: "none",
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
        aria-label="Show password"
      >
        👁
      </button>
    </div>
  )
}
