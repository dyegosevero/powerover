import { Metadata } from "next"
import InteractiveLink from "@modules/common/components/interactive-link"

export const metadata: Metadata = {
  title: "404 — Página não encontrada",
  description: "Esta página não existe.",
}

export default function NotFound() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "calc(100vh - 64px)",
      gap: 16, textAlign: "center", padding: "40px 24px",
    }}>
      <img src="/logo-powerover.png" alt="PowerOver" style={{ height: 48, width: "auto", marginBottom: 8 }} />
      <h1 style={{ fontSize: 72, fontWeight: 900, color: "#111", lineHeight: 1, margin: 0 }}>404</h1>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", margin: 0 }}>Página não encontrada</h2>
      <p style={{ fontSize: 14, color: "#777", maxWidth: 360, lineHeight: 1.6, margin: 0 }}>
        A página que você tentou acessar não existe ou foi removida.
      </p>
      <InteractiveLink href="/">Voltar para o início</InteractiveLink>
    </div>
  )
}
