"use client"

import { useState, useTransition } from "react"
import { addToCart } from "@lib/data/cart"

export default function AddToCartBtn({
  variantId,
  countryCode,
  hasMultipleVariants,
  handle,
}: {
  variantId?: string
  countryCode: string
  hasMultipleVariants: boolean
  handle: string
}) {
  const [isPending, startTransition] = useTransition()
  const [added, setAdded] = useState(false)

  if (hasMultipleVariants || !variantId) {
    return (
      <a
        href={`/${countryCode}/products/${handle}`}
        onClick={(e) => e.stopPropagation()}
        className="po-btn"
        style={{
          display: "block", width: "100%", padding: "9px 0",
          backgroundColor: "#111", color: "#fff", border: "none",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", cursor: "pointer",
          textAlign: "center", textDecoration: "none",
          marginTop: 10,
        }}
      >
        Selecionar opções
      </a>
    )
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        startTransition(async () => {
          await addToCart({ variantId, quantity: 1, countryCode })
          setAdded(true)
          setTimeout(() => setAdded(false), 2000)
        })
      }}
      disabled={isPending || added}
      className="po-btn"
      style={{
        display: "block", width: "100%", padding: "9px 0",
        backgroundColor: added ? "#4a8a1a" : isPending ? "#aaa" : "#51c020",
        color: "#fff", border: "none",
        fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
        textTransform: "uppercase", cursor: isPending ? "wait" : "pointer",
        marginTop: 10, transition: "background 0.2s",
      }}
    >
      {added ? "✓ Adicionado!" : isPending ? "Adicionando..." : "Adicionar ao carrinho"}
    </button>
  )
}
