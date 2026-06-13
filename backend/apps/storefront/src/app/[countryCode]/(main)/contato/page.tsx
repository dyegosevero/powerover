"use client"

import { useState } from "react"

export default function ContatoPage() {
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", mensagem: "" })
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder — integrar com e-mail/CRM depois
    setEnviado(true)
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

      {/* ── Cabeçalho ── */}
      <div style={{ marginBottom: 48 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7ac142", marginBottom: 8 }}>
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

        {/* ── Formulário ── */}
        <div style={{ flex: 1, minWidth: 280 }}>
          {enviado ? (
            <div style={{ padding: "32px 24px", backgroundColor: "#f5fdf0", border: "1px solid #c6e9a0", textAlign: "center" }}>
              <p style={{ fontSize: 24 }}>✓</p>
              <p style={{ fontWeight: 700, color: "#111", marginBottom: 4 }}>Mensagem enviada!</p>
              <p style={{ fontSize: 13, color: "#666" }}>Entraremos em contato em breve.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div>
                <label style={labelStyle}>Nome</label>
                <input
                  style={inputStyle}
                  type="text"
                  placeholder="Seu nome completo"
                  value={form.nome}
                  onChange={e => setForm({ ...form, nome: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>E-mail</label>
                <input
                  style={inputStyle}
                  type="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Telefone / WhatsApp</label>
                <input
                  style={inputStyle}
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={form.telefone}
                  onChange={e => setForm({ ...form, telefone: e.target.value })}
                />
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
                style={{
                  backgroundColor: "#7ac142", color: "#fff",
                  border: "none", padding: "14px 40px",
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase", cursor: "pointer",
                  width: "100%",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#69aa38")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#7ac142")}
              >
                Enviar mensagem
              </button>
            </form>
          )}
        </div>

        {/* ── Informações ── */}
        <div style={{ width: 260, flexShrink: 0 }}>
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#999", marginBottom: 12, borderBottom: "1px solid #ececec", paddingBottom: 8 }}>
              WhatsApp
            </p>
            <a
              href="https://wa.me/5521000000000"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 14, color: "#111", textDecoration: "none", fontWeight: 500 }}
            >
              (21) 00000-0000
            </a>
            <p style={{ fontSize: 12, color: "#999", marginTop: 4 }}>Seg–Sex, 9h às 18h</p>
          </div>

          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#999", marginBottom: 12, borderBottom: "1px solid #ececec", paddingBottom: 8 }}>
              E-mail
            </p>
            <a
              href="mailto:contato@poweroverloja.com.br"
              style={{ fontSize: 14, color: "#111", textDecoration: "none", fontWeight: 500 }}
            >
              contato@poweroverloja.com.br
            </a>
          </div>

          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#999", marginBottom: 12, borderBottom: "1px solid #ececec", paddingBottom: 8 }}>
              Localização
            </p>
            <p style={{ fontSize: 14, color: "#333", lineHeight: 1.6, margin: 0 }}>
              Petrópolis, RJ<br />Brasil
            </p>
          </div>

          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#999", marginBottom: 12, borderBottom: "1px solid #ececec", paddingBottom: 8 }}>
              Instagram
            </p>
            <a
              href="https://instagram.com/powerovermotorsports"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 14, color: "#111", textDecoration: "none", fontWeight: 500 }}
            >
              @powerovermotorsports
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
