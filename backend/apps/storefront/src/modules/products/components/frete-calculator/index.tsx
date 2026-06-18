"use client"

import { useState } from "react"

type FreteOpcao = {
  id: number
  nome: string
  empresa: string
  logo: string
  prazo: string
  preco: number
  preco_formatado: string
}

type FreteResultado = {
  localidade: string
  uf: string
  opcoes: FreteOpcao[]
}

export default function FreteCalculator({ productId }: { productId?: string }) {
  const [cep, setCep] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultado, setResultado] = useState<FreteResultado | null>(null)

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8)
    return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
  }

  const calcular = async () => {
    const digits = cep.replace(/\D/g, "")
    if (digits.length !== 8) {
      setError("Digite um CEP válido (8 dígitos).")
      return
    }
    setLoading(true)
    setError(null)
    setResultado(null)

    try {
      const params = new URLSearchParams({ cep: digits })
      if (productId) params.set("product_id", productId)

      const res = await fetch(`/api/frete?${params}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Erro ao calcular frete.")
      } else {
        setResultado(data)
      }
    } catch {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: 20, padding: "16px", border: "1px solid #e8e8e8" }}>
      <p style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#111",
        marginBottom: 10,
      }}>
        Calcular frete
      </p>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={cep}
          onChange={(e) => setCep(formatCep(e.target.value))}
          onKeyDown={(e) => e.key === "Enter" && calcular()}
          placeholder="00000-000"
          maxLength={9}
          style={{
            flex: 1,
            border: "none",
            borderBottom: "1px solid #111",
            outline: "none",
            fontSize: 13,
            padding: "6px 0",
            color: "#111",
            background: "transparent",
          }}
        />
        <button
          onClick={calcular}
          disabled={loading}
          style={{
            backgroundColor: "#111",
            color: "#fff",
            border: "none",
            padding: "6px 18px",
            fontSize: 11,
            fontWeight: 700,
            cursor: loading ? "wait" : "pointer",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "..." : "Calcular"}
        </button>
      </div>

      {error && (
        <p style={{ fontSize: 12, color: "#c0392b", marginTop: 8 }}>{error}</p>
      )}

      {resultado && (
        <div style={{ marginTop: 14 }}>
          <p style={{ fontSize: 11, color: "#888", marginBottom: 10 }}>
            Entregando em <strong style={{ color: "#111" }}>{resultado.localidade} — {resultado.uf}</strong>
          </p>

          {resultado.opcoes.length === 0 && (
            <p style={{ fontSize: 12, color: "#999" }}>Nenhuma opção de frete disponível para este CEP.</p>
          )}

          {resultado.opcoes.map((op) => (
            <div key={op.id} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 0",
              borderTop: "1px solid #f0f0f0",
              gap: 8,
            }}>
              {/* Logo + nome */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                {op.logo && (
                  <img
                    src={op.logo}
                    alt={op.empresa}
                    style={{ width: 28, height: 28, objectFit: "contain", flexShrink: 0 }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                  />
                )}
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#111", margin: 0 }}>{op.nome}</p>
                  <p style={{ fontSize: 11, color: "#888", margin: 0 }}>{op.prazo}</p>
                </div>
              </div>

              {/* Preço */}
              <span style={{ fontSize: 14, fontWeight: 700, color: "#111", flexShrink: 0 }}>
                {op.preco_formatado}
              </span>
            </div>
          ))}

          <p style={{ fontSize: 10, color: "#bbb", marginTop: 8 }}>
            * Prazo conta após confirmação do pagamento.
          </p>
        </div>
      )}

      {!resultado && !error && (
        <p style={{ fontSize: 11, color: "#999", marginTop: 8 }}>
          Envio para todo o Brasil via Correios e transportadoras.
        </p>
      )}
    </div>
  )
}
