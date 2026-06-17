"use client"

import { useState } from "react"

const font = "var(--font-montserrat), 'Montserrat', sans-serif"

type TrackEvent = {
  description: string
  date: string
  time?: string
  location?: string
}

type TrackResult = {
  code: string
  carrier?: string
  status?: string
  events: TrackEvent[]
}

export default function RastreamentoPage() {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TrackResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const track = async (e: React.FormEvent) => {
    e.preventDefault()
    const c = code.trim().toUpperCase()
    if (!c) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
      const pubKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
      const res = await fetch(`${backendUrl}/store/rastreamento?code=${encodeURIComponent(c)}`, {
        headers: { "x-publishable-api-key": pubKey },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erro ao rastrear")
      setResult(data)
    } catch (err: any) {
      setError(err.message || "Erro ao rastrear. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px", fontFamily: font }}>

      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#51c020", marginBottom: 8 }}>
          Pedidos
        </p>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "#111", margin: "0 0 12px", lineHeight: 1.1 }}>
          Rastrear pedido
        </h1>
        <p style={{ fontSize: 14, color: "#777", lineHeight: 1.7, margin: 0 }}>
          Digite o código de rastreio que enviamos por e-mail para acompanhar a entrega.
        </p>
      </div>

      <form onSubmit={track} style={{ display: "flex", gap: 10, marginBottom: 40 }}>
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="Ex: AA123456789BR"
          style={{
            flex: 1, border: "none", borderBottom: "2px solid #111",
            padding: "10px 0", fontSize: 15, color: "#111",
            background: "transparent", outline: "none", fontFamily: font,
            letterSpacing: "0.05em",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#111", color: "#fff", border: "none",
            padding: "10px 28px", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
            cursor: loading ? "wait" : "pointer", opacity: loading ? 0.6 : 1,
            whiteSpace: "nowrap",
          }}
        >
          {loading ? "Buscando..." : "Rastrear"}
        </button>
      </form>

      {error && (
        <div style={{ padding: "14px 18px", background: "#fff5f5", border: "1px solid #fcc", fontSize: 13, color: "#c00", marginBottom: 24 }}>
          {error}
        </div>
      )}

      {result && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, padding: "14px 18px", background: "#f5fdf0", border: "1px solid #c6e9a0" }}>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: "#666" }}>Código</p>
              <p style={{ margin: "2px 0 0", fontSize: 15, fontWeight: 700, color: "#111", letterSpacing: "0.05em" }}>{result.code}</p>
            </div>
            {result.status && (
              <span style={{
                background: "#51c020", color: "#fff",
                fontSize: 11, fontWeight: 700, padding: "4px 14px",
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                {result.status}
              </span>
            )}
          </div>

          {result.events.length === 0 && (
            <p style={{ fontSize: 13, color: "#999", textAlign: "center", padding: 32 }}>
              Nenhum evento encontrado. O rastreio pode demorar até 24h após o envio.
            </p>
          )}

          <div style={{ position: "relative" }}>
            {result.events.map((ev, i) => (
              <div key={i} style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{
                    width: 12, height: 12, borderRadius: "50%",
                    background: i === 0 ? "#51c020" : "#ddd",
                    border: i === 0 ? "none" : "2px solid #ddd",
                    marginTop: 3, flexShrink: 0,
                  }} />
                  {i < result.events.length - 1 && (
                    <div style={{ width: 1, flex: 1, background: "#ebebeb", minHeight: 20, marginTop: 4 }} />
                  )}
                </div>
                <div style={{ paddingBottom: 4 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? "#111" : "#555" }}>
                    {ev.description}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: "#999" }}>
                    {ev.date}{ev.time ? ` às ${ev.time}` : ""}{ev.location ? ` — ${ev.location}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 48, padding: "20px 0", borderTop: "1px solid #ebebeb", fontSize: 12, color: "#999", lineHeight: 1.7 }}>
        <p style={{ margin: 0 }}>
          Dúvidas sobre seu pedido?{" "}
          <a href="/br/contato" style={{ color: "#111", fontWeight: 600 }}>Entre em contato</a>{" "}
          com nossa equipe.
        </p>
      </div>
    </div>
  )
}
