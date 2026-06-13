"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  categories?: HttpTypes.StoreProductCategory[]
  "data-testid"?: string
}

const PRICE_RANGES = [
  { label: "Até R$500", min: 0, max: 500 },
  { label: "R$500 – R$2.000", min: 500, max: 2000 },
  { label: "R$2.000 – R$10.000", min: 2000, max: 10000 },
  { label: "R$10.000 – R$50.000", min: 10000, max: 50000 },
  { label: "Acima de R$50.000", min: 50000, max: null },
]

const SORT_OPTIONS = [
  { value: "created_at", label: "Mais recentes" },
  { value: "price_asc", label: "Preço: menor → maior" },
  { value: "price_desc", label: "Preço: maior → menor" },
]

const mainCategories = [
  { label: "Suspensão", href: "/categories/suspensao" },
  { label: "Câmbio", href: "/categories/cambio" },
  { label: "Kit Ângulo", href: "/categories/kit-angulo" },
  { label: "Peças Avulsas", href: "/store" },
]

const itemStyle: React.CSSProperties = {
  display: "block", padding: "7px 0",
  fontSize: 13, fontWeight: 400,
  color: "#333", textDecoration: "none",
  borderBottom: "1px solid #f5f5f5",
}

const SECTION = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 28 }}>
    <p style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
      textTransform: "uppercase", color: "#999", marginBottom: 0,
      borderBottom: "1px solid #ececec", paddingBottom: 8,
    }}>
      {title}
    </p>
    {children}
  </div>
)

const CAR_OPTIONS = [
  { label: "Chevette", value: "chevette" },
  { label: "BMW E36", value: "bmw" },
]

const RefinementList = ({
  sortBy,
  "data-testid": dataTestId,
  categories = [],
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)
  const activeCar = searchParams.get("car") ?? null

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  const rootCategories = categories.filter((c) => !c.parent_category_id)

  return (
    <aside style={{
      minWidth: 200, width: 200, flexShrink: 0,
      marginRight: 40, paddingTop: 4,
      position: "sticky", top: 72, alignSelf: "flex-start",
    }}>

      {/* ── Carro ── */}
      <SECTION title="Carro">
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {CAR_OPTIONS.map((car) => {
            const active = activeCar === car.value
            return (
              <li key={car.value} style={{ borderBottom: "1px solid #f5f5f5" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "7px 0" }}>
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => {
                      const params = new URLSearchParams(searchParams)
                      if (active) {
                        params.delete("car")
                      } else {
                        params.set("car", car.value)
                      }
                      router.push(`${pathname}?${params.toString()}`)
                    }}
                    style={{ accentColor: "#51c020", cursor: "pointer", margin: 0 }}
                  />
                  <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "#51c020" : "#333" }}>
                    {car.label}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      </SECTION>

      {/* ── Categorias ── */}
      <SECTION title="Categorias">
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {mainCategories.map((cat) => {
            const active = pathname === cat.href || (cat.href !== "/store" && pathname.includes(cat.href))
            return (
              <li key={cat.href}>
                <LocalizedClientLink
                  href={cat.href}
                  style={{
                    ...itemStyle,
                    fontWeight: active ? 600 : 400,
                    color: active ? "#51c020" : "#333",
                  }}
                >
                  {cat.label}
                </LocalizedClientLink>
              </li>
            )
          })}
        </ul>
      </SECTION>

      {/* ── Subcategorias ── */}
      {rootCategories.length > 0 && (
        <SECTION title="Subcategorias">
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {rootCategories.map((cat) => (
              <li key={cat.id}>
                <LocalizedClientLink href={`/categories/${cat.handle}`} style={itemStyle}>
                  {cat.name}
                </LocalizedClientLink>
                {cat.category_children && cat.category_children.length > 0 && (
                  <ul style={{ listStyle: "none", padding: "0 0 0 12px", margin: 0 }}>
                    {cat.category_children.map((sub: any) => (
                      <li key={sub.id}>
                        <LocalizedClientLink
                          href={`/categories/${sub.handle}`}
                          style={{ ...itemStyle, color: "#666" }}
                        >
                          {sub.name}
                        </LocalizedClientLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </SECTION>
      )}

      {/* ── Faixa de preço ── */}
      <SECTION title="Faixa de preço">
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {PRICE_RANGES.map((range, i) => (
            <li key={i} style={{ borderBottom: "1px solid #f5f5f5" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "7px 0" }}>
                <input
                  type="radio"
                  name="price_range"
                  checked={selectedPrice === i}
                  onChange={() => {
                    setSelectedPrice(i)
                    setQueryParams("price_min", String(range.min * 100))
                    if (range.max !== null) setQueryParams("price_max", String(range.max * 100))
                  }}
                  style={{ accentColor: "#51c020", cursor: "pointer", margin: 0 }}
                />
                <span style={{ fontSize: 13, color: "#333" }}>{range.label}</span>
              </label>
            </li>
          ))}
          {selectedPrice !== null && (
            <li style={{ paddingTop: 8 }}>
              <button
                onClick={() => {
                  setSelectedPrice(null)
                  const params = new URLSearchParams(searchParams)
                  params.delete("price_min")
                  params.delete("price_max")
                  router.push(`${pathname}?${params.toString()}`)
                }}
                style={{
                  fontSize: 11, color: "#51c020", background: "none",
                  border: "none", cursor: "pointer", padding: 0,
                  textDecoration: "underline",
                }}
              >
                Limpar filtro
              </button>
            </li>
          )}
        </ul>
      </SECTION>

      {/* ── Ordenar por ── */}
      <SECTION title="Ordenar por">
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {SORT_OPTIONS.map((opt) => (
            <li key={opt.value} style={{ borderBottom: "1px solid #f5f5f5" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "7px 0" }}>
                <input
                  type="radio"
                  name="sort_by"
                  checked={sortBy === opt.value}
                  onChange={() => setQueryParams("sortBy", opt.value)}
                  style={{ accentColor: "#51c020", cursor: "pointer", margin: 0 }}
                />
                <span style={{ fontSize: 13, color: "#333" }}>{opt.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </SECTION>

    </aside>
  )
}

export default RefinementList
