import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404 — Página não encontrada",
  description: "Esta página não existe.",
}

export default function NotFound() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "100vh",
      gap: 16, textAlign: "center", padding: "40px 24px",
    }}>
      <img src="/logo-powerover.png" alt="PowerOver" style={{ height: 48, width: "auto", marginBottom: 8 }} />
      <h1 style={{ fontSize: 72, fontWeight: 900, color: "#111", lineHeight: 1, margin: 0 }}>404</h1>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", margin: 0 }}>Página não encontrada</h2>
      <p style={{ fontSize: 14, color: "#777", maxWidth: 360, lineHeight: 1.6, margin: 0 }}>
        A página que você tentou acessar não existe ou foi removida.
      </p>
      <Link href="/" style={{
        display: "inline-block", marginTop: 8,
        backgroundColor: "#7ac142", color: "#fff",
        padding: "12px 32px", fontSize: 11, fontWeight: 700,
        letterSpacing: "0.12em", textTransform: "uppercase",
        textDecoration: "none",
      }}>
        Voltar para o início
      </Link>
    </div>
  )
}
