"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"

const font = "var(--font-montserrat), 'Montserrat', sans-serif"

export default function SearchBar({ countryCode }: { countryCode: string }) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/${countryCode}/store?q=${encodeURIComponent(q)}`)
    setOpen(false)
    setQuery("")
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setOpen(false); setQuery("") }
  }

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  return (
    <div style={{ position: "relative" }}>
      {open ? (
        <form onSubmit={submit} style={{
          display: "flex", alignItems: "center",
          borderBottom: "1px solid #111", padding: "4px 0", gap: 6,
          minWidth: 220,
        }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar produtos..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            onBlur={() => { if (!query) setOpen(false) }}
            style={{
              border: "none", outline: "none", fontSize: 13,
              color: "#111", fontFamily: font, width: "100%",
              background: "transparent",
            }}
          />
          <button type="submit" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>
      ) : (
        <button
          onClick={() => setOpen(true)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
          aria-label="Buscar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      )}
    </div>
  )
}
