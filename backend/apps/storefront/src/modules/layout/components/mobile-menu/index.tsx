"use client"

import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const font = "var(--font-anton), 'Anton', sans-serif"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Loja", href: "/store" },
  { label: "Suspensão", href: "/categories/suspensao" },
  { label: "Câmbio", href: "/categories/cambio" },
  { label: "Kit Ângulo", href: "/categories/kit-angulo" },
  { label: "Contato", href: "/contato" },
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <style>{`
        .mobile-menu-btn { display: none; }
        .mobile-nav-links { display: flex; }
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex; align-items: center; justify-content: center; }
          .mobile-nav-links { display: none; }
        }
      `}</style>

      {/* Hamburger button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setOpen(!open)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          padding: "8px", color: "#111", marginLeft: "auto", flexShrink: 0,
        }}
        aria-label="Menu"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {/* Overlay fullscreen */}
      {open && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            backgroundColor: "#111",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 0,
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            style={{
              position: "absolute", top: 16, right: 20,
              background: "none", border: "none", cursor: "pointer",
              color: "#fff", padding: 8,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {navLinks.map((link) => (
            <LocalizedClientLink
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: font,
                fontSize: "clamp(2.4rem, 10vw, 3.5rem)",
                fontWeight: 400,
                color: "#fff",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                padding: "18px 40px",
                width: "100%",
                textAlign: "center",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#51c020")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
            >
              {link.label}
            </LocalizedClientLink>
          ))}
        </div>
      )}
    </>
  )
}
