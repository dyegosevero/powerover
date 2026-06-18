"use client"

import { useState } from "react"

export default function ContatoPage() {
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", mensagem: "" })
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro(null)

    try {
      const res = await fetch(`/api/contato`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erro ao enviar")
      setEnviado(true)
    } catch (err: any) {
      setErro(err.message || "Erro ao enviar. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 0",
    border: "none", borderBottom: "1px solid #ddd",
    fontSize: 14, color: "#111", background: "transparent",
    outline: "none", marginBottom: 24,
  }
  const labelStyle: React.CSSProperties = {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
    textTransform: "uppercase", color: "#999", display: "block", marginBottom: 4,
  }

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 40px" }}>

      <div style={{ marginBottom: 48 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#1a6eff", marginBottom: 8 }}>
          Fale conosco
        </p>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, color: "#111", margin: 0, lineHeight: 1.1 }}>
          Entre em contato
        </h1>
        <p style={{ fontSize: 14, color: "#777", marginTop: 12, maxWidth: 500, lineHeight: 1.7 }}>
          Dúvidas sobre produtos, pedidos ou instalação? Nossa equipe responde em até 24h úteis.
        </p>
      </div>

      <div style={{ display: "flex", gap: 80, flexWrap: "wrap" }}>

        {/* Formulário */}
        <div style={{ flex: 1, minWidth: 280 }}>
          {enviado ? (
            <div style={{ padding: "32px 24px", backgroundColor: "#f5fdf0", border: "1px solid #c6e9a0", textAlign: "center" }}>
              <p style={{ fontSize: 32, margin: "0 0 8px" }}>✓</p>
              <p style={{ fontWeight: 700, color: "#111", marginBottom: 4 }}>Mensagem enviada!</p>
              <p style={{ fontSize: 13, color: "#666", margin: 0 }}>Entraremos em contato em até 24h úteis.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {erro && (
                <div style={{ marginBottom: 20, padding: "12px 16px", background: "#fff5f5", border: "1px solid #fcc", fontSize: 13, color: "#c00" }}>
                  {erro}
                </div>
              )}
              <div>
                <label style={labelStyle}>Nome</label>
                <input style={inputStyle} type="text" placeholder="Seu nome completo" value={form.nome}
                  onChange={e => setForm({ ...form, nome: e.target.value })} required />
              </div>
              <div>
                <label style={labelStyle}>E-mail</label>
                <input style={inputStyle} type="email" placeholder="seu@email.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label style={labelStyle}>Telefone / WhatsApp</label>
                <input style={inputStyle} type="tel" placeholder="(00) 00000-0000" value={form.telefone}
                  onChange={e => setForm({ ...form, telefone: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Mensagem</label>
                <textarea
                  style={{ ...inputStyle, resize: "vertical", minHeight: 120 } as React.CSSProperties}
                  placeholder="Descreva sua dúvida ou pedido..."
                  value={form.mensagem}
                  onChange={e => setForm({ ...form, mensagem: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="po-btn"
                style={{
                  background: "linear-gradient(135deg, #001a80 0%, #1a6eff 100%)", color: "#fff",
                  border: "none", padding: "14px 40px",
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase", cursor: loading ? "wait" : "pointer",
                  width: "100%", opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Enviando..." : "Enviar mensagem"}
              </button>
            </form>
          )}
        </div>

        {/* Informações */}
        <div style={{ width: 260, flexShrink: 0 }}>
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#999", marginBottom: 12, borderBottom: "1px solid #ececec", paddingBottom: 8 }}>
              WhatsApp
            </p>
            <a href="https://wa.me/5541999999999" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 14, color: "#111", textDecoration: "none", fontWeight: 500 }}>
              (41) 99999-9999
            </a>
            <p style={{ fontSize: 12, color: "#999", marginTop: 4 }}>Seg–Sex, 9h às 18h</p>
          </div>

          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#999", marginBottom: 12, borderBottom: "1px solid #ececec", paddingBottom: 8 }}>
              E-mail
            </p>
            <a href="mailto:contato@powerover.com.br"
              style={{ fontSize: 14, color: "#111", textDecoration: "none", fontWeight: 500 }}>
              contato@powerover.com.br
            </a>
          </div>

          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#999", marginBottom: 12, borderBottom: "1px solid #ececec", paddingBottom: 8 }}>
              Localização
            </p>
            <p style={{ fontSize: 14, color: "#333", lineHeight: 1.6, margin: 0 }}>
              Colombo, PR<br />Brasil
            </p>
          </div>

          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#999", marginBottom: 12, borderBottom: "1px solid #ececec", paddingBottom: 8 }}>
              Instagram
            </p>
            <a href="https://instagram.com/powerovermotorsports" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 14, color: "#111", textDecoration: "none", fontWeight: 500 }}>
              @powerovermotorsports
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
