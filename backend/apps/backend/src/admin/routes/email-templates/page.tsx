import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useState, useEffect } from "react"

// ─── Ícone de e-mail para o menu lateral ───────────────────────
export const config = defineRouteConfig({
  label: "Templates de E-mail",
  icon: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
})

type Template = {
  label: string
  description: string
  subject: string
  html: string
}

type Templates = Record<string, Template>

const BACKEND = ""  // same origin via admin proxy

// ─── Componente principal ───────────────────────────────────────
export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<Templates>({})
  const [selected, setSelected] = useState<string>("")
  const [subject, setSubject] = useState("")
  const [html, setHtml] = useState("")
  const [testEmail, setTestEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null)
  const [tab, setTab] = useState<"editor" | "preview">("editor")
  const [dirty, setDirty] = useState(false)

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  // Carregar templates
  useEffect(() => {
    setLoading(true)
    fetch("/admin/email-templates", {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((data) => {
        setTemplates(data.templates || {})
        const first = Object.keys(data.templates || {})[0]
        if (first) selectTemplate(first, data.templates)
      })
      .catch(() => showToast("Erro ao carregar templates", "error"))
      .finally(() => setLoading(false))
  }, [])

  const selectTemplate = (id: string, tpls?: Templates) => {
    const source = tpls || templates
    if (dirty && selected && !confirm("Você tem alterações não salvas. Descartar?")) return
    setSelected(id)
    setSubject(source[id]?.subject || "")
    setHtml(source[id]?.html || "")
    setDirty(false)
    setTab("editor")
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/admin/email-templates", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected, subject, html }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTemplates((prev) => ({ ...prev, [selected]: { ...prev[selected], subject, html } }))
      setDirty(false)
      showToast("Template salvo com sucesso!")
    } catch (e: any) {
      showToast(e.message || "Erro ao salvar", "error")
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    if (!testEmail) return showToast("Digite um e-mail para teste", "error")
    setTesting(true)
    try {
      const res = await fetch("/admin/email-templates", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected, to: testEmail }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showToast(`E-mail de teste enviado para ${testEmail}!`)
    } catch (e: any) {
      showToast(e.message || "Erro ao enviar teste", "error")
    } finally {
      setTesting(false)
    }
  }

  const handleReset = () => {
    if (!confirm("Restaurar o template padrão? As edições serão perdidas.")) return
    selectTemplate(selected)
  }

  // Preview com variáveis substituídas
  const previewHtml = html
    .replace(/\{\{customer_name\}\}/g, "João Silva")
    .replace(/\{\{order_id\}\}/g, "#PO-001")
    .replace(/\{\{total\}\}/g, "R$ 1.990,00")
    .replace(/\{\{tracking_number\}\}/g, "AA123456789BR")
    .replace(/\{\{reset_url\}\}/g, "#")

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400, color: "#999", fontSize: 14 }}>
        Carregando templates...
      </div>
    )
  }

  return (
    <div style={{ display: "flex", height: "calc(100vh - 64px)", overflow: "hidden", fontFamily: "inherit" }}>

      {/* ── Sidebar: lista de templates ── */}
      <aside style={{
        width: 240, flexShrink: 0, borderRight: "1px solid #e5e7eb",
        background: "#fafafa", padding: "20px 0", overflowY: "auto",
      }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#9ca3af", padding: "0 16px 12px" }}>
          Templates
        </p>
        {Object.entries(templates).map(([id, tpl]) => (
          <button
            key={id}
            onClick={() => selectTemplate(id)}
            style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "12px 16px", border: "none", cursor: "pointer",
              background: selected === id ? "#fff" : "transparent",
              borderLeft: selected === id ? "3px solid #10b981" : "3px solid transparent",
              transition: "all .15s",
            }}
          >
            <p style={{ margin: 0, fontSize: 13, fontWeight: selected === id ? 600 : 400, color: selected === id ? "#111" : "#374151" }}>
              {tpl.label}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9ca3af", lineHeight: 1.4 }}>
              {tpl.description}
            </p>
          </button>
        ))}
      </aside>

      {/* ── Editor principal ── */}
      {selected ? (
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Header */}
          <div style={{
            padding: "16px 24px", borderBottom: "1px solid #e5e7eb",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#fff",
          }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#111" }}>
                {templates[selected]?.label}
                {dirty && <span style={{ marginLeft: 8, fontSize: 11, color: "#f59e0b", fontWeight: 400 }}>● não salvo</span>}
              </h2>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>
                Evento: <code style={{ background: "#f3f4f6", padding: "1px 6px", borderRadius: 3 }}>{selected}</code>
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleReset}
                style={btnStyle("ghost")}
              >
                Restaurar padrão
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !dirty}
                style={btnStyle("primary", saving || !dirty)}
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>

          {/* Subject */}
          <div style={{ padding: "16px 24px 0", background: "#fff", borderBottom: "1px solid #f3f4f6" }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Assunto do e-mail
            </label>
            <input
              value={subject}
              onChange={(e) => { setSubject(e.target.value); setDirty(true) }}
              style={{
                width: "100%", boxSizing: "border-box",
                border: "1px solid #d1d5db", borderRadius: 6, padding: "8px 12px",
                fontSize: 13, color: "#111", outline: "none", marginBottom: 12,
                fontFamily: "inherit",
              }}
              placeholder="Assunto..."
            />
          </div>

          {/* Tabs: Editor / Preview */}
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #e5e7eb", background: "#fff", padding: "0 24px" }}>
            {(["editor", "preview"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "10px 16px", border: "none", cursor: "pointer", background: "none",
                  fontSize: 13, fontWeight: tab === t ? 600 : 400,
                  color: tab === t ? "#10b981" : "#6b7280",
                  borderBottom: tab === t ? "2px solid #10b981" : "2px solid transparent",
                  transition: "all .15s", marginBottom: -1,
                }}
              >
                {t === "editor" ? "✏️ Editor HTML" : "👁 Preview"}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <p style={{ margin: "auto 0", fontSize: 11, color: "#9ca3af" }}>
              Variáveis: <code style={{ background: "#f3f4f6", padding: "1px 4px", borderRadius: 3, fontSize: 10 }}>{"{{customer_name}}"}</code>{" "}
              <code style={{ background: "#f3f4f6", padding: "1px 4px", borderRadius: 3, fontSize: 10 }}>{"{{order_id}}"}</code>{" "}
              <code style={{ background: "#f3f4f6", padding: "1px 4px", borderRadius: 3, fontSize: 10 }}>{"{{total}}"}</code>{" "}
              <code style={{ background: "#f3f4f6", padding: "1px 4px", borderRadius: 3, fontSize: 10 }}>{"{{tracking_number}}"}</code>
            </p>
          </div>

          {/* Editor / Preview body */}
          <div style={{ flex: 1, overflow: "hidden", background: tab === "preview" ? "#f3f4f6" : "#1e1e1e" }}>
            {tab === "editor" ? (
              <textarea
                value={html}
                onChange={(e) => { setHtml(e.target.value); setDirty(true) }}
                spellCheck={false}
                style={{
                  width: "100%", height: "100%", boxSizing: "border-box",
                  border: "none", outline: "none", resize: "none",
                  padding: "20px 24px", fontSize: 13, lineHeight: 1.6,
                  fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
                  background: "#1e1e1e", color: "#d4d4d4",
                }}
              />
            ) : (
              <div style={{ height: "100%", overflow: "auto", padding: 24 }}>
                <div style={{ maxWidth: 600, margin: "0 auto", background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,.12)" }}>
                  {/* Email mock header */}
                  <div style={{ background: "#111", padding: "20px 28px", textAlign: "center" }}>
                    <p style={{ margin: 0, color: "#51c020", fontSize: 11, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase" }}>
                      PowerOver Motorsports
                    </p>
                  </div>
                  <div
                    style={{ padding: "28px 28px", fontSize: 14, lineHeight: 1.7, color: "#333" }}
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                  <div style={{ background: "#f9f9f9", padding: "14px 28px", textAlign: "center", borderTop: "1px solid #eee" }}>
                    <p style={{ margin: 0, fontSize: 11, color: "#999" }}>loja.powerover.com.br · @powerovermotorsport</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer: Envio de teste */}
          <div style={{
            padding: "12px 24px", borderTop: "1px solid #e5e7eb", background: "#fff",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>Enviar teste para:</span>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTest()}
              placeholder="email@exemplo.com"
              style={{
                flex: 1, border: "1px solid #d1d5db", borderRadius: 6,
                padding: "6px 10px", fontSize: 13, outline: "none", fontFamily: "inherit",
              }}
            />
            <button
              onClick={handleTest}
              disabled={testing}
              style={btnStyle("secondary", testing)}
            >
              {testing ? "Enviando..." : "📨 Enviar teste"}
            </button>
          </div>
        </main>
      ) : (
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 14 }}>
          Selecione um template para editar
        </main>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          background: toast.type === "success" ? "#10b981" : "#ef4444",
          color: "#fff", padding: "12px 20px", borderRadius: 8,
          fontSize: 13, fontWeight: 500, boxShadow: "0 4px 16px rgba(0,0,0,.2)",
          animation: "slideIn .2s ease",
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}

// ─── Helper: estilos de botão ───────────────────────────────────
function btnStyle(variant: "primary" | "secondary" | "ghost", disabled?: boolean): React.CSSProperties {
  const base: React.CSSProperties = {
    padding: "7px 16px", borderRadius: 6, fontSize: 13, fontWeight: 500,
    cursor: disabled ? "not-allowed" : "pointer", border: "none",
    opacity: disabled ? 0.5 : 1, whiteSpace: "nowrap", transition: "all .15s",
  }
  if (variant === "primary") return { ...base, background: "#10b981", color: "#fff" }
  if (variant === "secondary") return { ...base, background: "#111", color: "#fff" }
  return { ...base, background: "transparent", color: "#6b7280", border: "1px solid #d1d5db" }
}
