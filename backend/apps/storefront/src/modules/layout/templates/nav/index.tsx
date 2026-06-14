import { Suspense } from "react"
import { headers } from "next/headers"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import NavLinks from "@modules/layout/components/nav-links"
import SearchBar from "@modules/layout/components/search-bar"
import MobileMenu from "@modules/layout/components/mobile-menu"

const font = "var(--font-montserrat), 'Montserrat', sans-serif"

export default async function Nav() {
  // Extrai countryCode do pathname (ex: /br/store → "br")
  const headersList = await headers()
  const pathname = headersList.get("x-invoke-path") || headersList.get("next-url") || "/br"
  const countryCode = pathname.split("/")[1] || "br"

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
      <header style={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #e8e8e8",
        height: 50,
        overflow: "visible",
        fontFamily: font,
      }}>
        <div style={{
          width: "100%",
          padding: "0 32px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          overflow: "visible",
          boxSizing: "border-box",
          position: "relative",
        }}>

          {/* Logo */}
          <LocalizedClientLink href="/" style={{ textDecoration: "none", marginRight: 40, flexShrink: 0, display: "flex" }}>
            <img
              src="/logo-po.png"
              alt="PowerOver"
              style={{ height: 44, width: "auto", display: "block", transform: "translateY(9px)" }}
            />
          </LocalizedClientLink>

          {/* Nav links — oculto no mobile */}
          <div className="desktop-nav"><NavLinks /></div>

          {/* Right: search + icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexShrink: 0, marginLeft: "auto" }}>
            <style>{`
              .desktop-nav { display: flex; height: 100%; }
              @media (max-width: 768px) { .desktop-nav { display: none; } }
              [data-testid="nav-cart-link"] svg { width: 17px !important; height: 17px !important; display: block; }
            `}</style>

            <SearchBar countryCode={countryCode} />

            {/* Account */}
            <LocalizedClientLink href="/account" style={{ color: "#111", display: "flex", alignItems: "center" }} data-testid="nav-account-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </LocalizedClientLink>

            {/* Cart */}
            <Suspense fallback={
              <LocalizedClientLink href="/cart" style={{ color: "#111", display: "flex", alignItems: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </LocalizedClientLink>
            }>
              <CartButton />
            </Suspense>
          </div>

          {/* Hamburger — só mobile */}
          <MobileMenu />

        </div>
      </header>
    </div>
  )
}
