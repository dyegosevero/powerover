"use client"

import { usePathname } from "next/navigation"
import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const font = "var(--font-montserrat), 'Montserrat', sans-serif"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Loja", href: "/store" },
  { label: "Drift", href: "/categories/drift" },
  { label: "Track", href: "/categories/track" },
  { label: "Preparação", href: "/categories/preparacao" },
  { label: "Contato", href: "/contato" },
]

export default function NavLinks() {
  const pathname = usePathname()
  const [hovered, setHovered] = useState<string | null>(null)
  const cleanPath = pathname.replace(/^\/[a-z]{2}/, "") || "/"

  return (
    <nav style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "stretch", height: "100%" }}>
      {navLinks.map((link) => {
        const isActive = cleanPath === link.href || (link.href !== "/" && cleanPath.startsWith(link.href))
        const isHovered = hovered === link.label && !isActive
        return (
          <LocalizedClientLink
            key={link.label}
            href={link.href}
            onMouseEnter={() => setHovered(link.label)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
              fontSize: 16,
              fontWeight: 600,
              color: isActive ? "#fff" : "#333",
              backgroundColor: isActive ? "#111" : "transparent",
              textDecoration: isHovered ? "underline" : "none",
              textUnderlineOffset: 3,
              fontFamily: font,
              whiteSpace: "nowrap",
              letterSpacing: "0.01em",
              height: "100%",
            }}
          >
            {link.label}
          </LocalizedClientLink>
        )
      })}
    </nav>
  )
}
