import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Crumb = { label: string; href?: string }

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20, fontSize: 12, color: "#aaa" }}>
      {crumbs.map((c, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i > 0 && <span>/</span>}
          {c.href ? (
            <LocalizedClientLink href={c.href} style={{ color: "#aaa", textDecoration: "none" }}>
              {c.label}
            </LocalizedClientLink>
          ) : (
            <span style={{ color: "#555", fontWeight: 500 }}>{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
