"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"

const font = "var(--font-montserrat), 'Montserrat', sans-serif"
const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

type Suggestion = { id: string; title: string; thumbnail: string | null; handle: string; price?: string }

export default function SearchBar({ countryCode }: { countryCode: string }) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/${countryCode}/store?q=${encodeURIComponent(q)}`)
    close()
  }

  const close = () => {
    setOpen(false)
    setQuery("")
    setSuggestions([])
  }

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (query.trim().length < 2) { setSuggestions([]); return }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `${BACKEND}/store/products?q=${encodeURIComponent(query.trim())}&limit=6&fields=id,title,handle,thumbnail,variants.calculated_price`,
          { headers: { "x-publishable-api-key": PUB_KEY } }
        )
        const data = await res.json()
        const prods = data.products || []
        setSuggestions(prods.map((p: any) => ({
          id: p.id,
          title: p.title,
          thumbnail: p.thumbnail,
          handle: p.handle,
          price: p.variants?.[0]?.calculated_price?.calculated_amount
            ? (p.variants[0].calculated_price.calculated_amount / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
            : null,
        })))
      } catch { setSuggestions([]) }
      finally { setLoading(false) }
    }, 280)
  }, [query])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) close()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {open ? (
        <form onSubmit={submit} style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #111", padding: "4px 0", gap: 6, minWidth: 240 }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar produtos..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Escape" && close()}
            style={{ border: "none", outline: "none", fontSize: 13, color: "#111", fontFamily: font, width: "100%", background: "transparent" }}
          />
          {loading
            ? <span style={{ fontSize: 11, color: "#999" }}>...</span>
            : (
              <button type="submit" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            )
          }
        </form>
      ) : (
        <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }} aria-label="Buscar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      )}

      {/* Dropdown de sugestões */}
      {open && suggestions.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 12px)", right: 0,
          width: 320, background: "#fff",
          boxShadow: "0 8px 32px rgba(0,0,0,.12)", zIndex: 200,
          border: "1px solid #ebebeb",
        }}>
          {suggestions.map((s) => (
            <button
              key={s.id}
              onMouseDown={() => {
                router.push(`/${countryCode}/products/${s.handle}`)
                close()
              }}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                width: "100%", padding: "10px 14px", border: "none",
                background: "none", cursor: "pointer", textAlign: "left",
                borderBottom: "1px solid #f5f5f5",
              }}
            >
              <div style={{ width: 44, height: 44, flexShrink: 0, background: "#f5f5f5", position: "relative", overflow: "hidden" }}>
                {s.thumbnail && (
                  <Image src={s.thumbnail} alt={s.title} fill sizes="44px" style={{ objectFit: "cover" }} />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.title}
                </p>
                {s.price && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#51c020", fontWeight: 600 }}>{s.price}</p>}
              </div>
            </button>
          ))}
          <button
            onMouseDown={() => submit()}
            style={{ display: "block", width: "100%", padding: "10px 14px", border: "none", background: "#fafafa", cursor: "pointer", fontSize: 12, color: "#666", textAlign: "center" }}
          >
            Ver todos os resultados para "<strong>{query}</strong>"
          </button>
        </div>
      )}
    </div>
  )
}
