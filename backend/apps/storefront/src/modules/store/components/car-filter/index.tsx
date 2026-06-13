"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

type CarOption = "todos" | "chevette" | "bmw"

export default function CarFilter({ current }: { current?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setCarFilter = useCallback(
    (car: CarOption) => {
      const params = new URLSearchParams(searchParams)
      if (car === "todos") {
        params.delete("car")
      } else {
        params.set("car", car)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  const active = (current ?? "todos") as CarOption

  const btn = (label: string, value: CarOption) => {
    const isActive = active === value
    return (
      <button
        key={value}
        onClick={() => setCarFilter(value)}
        style={{
          padding: "8px 20px",
          borderRadius: 4,
          border: isActive ? "2px solid #51c020" : "2px solid #d8d8d8",
          background: isActive ? "#51c020" : "#fff",
          color: isActive ? "#fff" : "#333",
          fontFamily: "inherit",
          fontSize: 13,
          fontWeight: isActive ? 700 : 500,
          cursor: "pointer",
          transition: "all 0.15s",
          letterSpacing: isActive ? "0.04em" : "0",
        }}
      >
        {label}
      </button>
    )
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 24, flexWrap: "wrap" }}>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#999", marginRight: 4 }}>
        Compatível com:
      </span>
      {btn("Todos", "todos")}
      {btn("Chevette", "chevette")}
      {btn("BMW E36", "bmw")}
    </div>
  )
}
