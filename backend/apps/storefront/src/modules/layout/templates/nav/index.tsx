import { Suspense } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import NavLinks from "@modules/layout/components/nav-links"

const font = "var(--font-montserrat), 'Montserrat', sans-serif"

export default function Nav() {
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

          {/* Logo — overflow ligeiro como no Wisefab */}
          <LocalizedClientLink href="/" style={{ textDecoration: "none", marginRight: 40, flexShrink: 0, display: "flex" }}>
            <img
              src="/logo-po.png"
              alt="PowerOver"
              style={{ height: 44, width: "auto", display: "block", transform: "translateY(9px)" }}
            />
          </LocalizedClientLink>

          {/* Nav links */}
          <NavLinks />

          {/* Right: search + icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexShrink: 0, marginLeft: "auto" }}>
            {/* Search — compacta, sem borda vermelha */}
            <div style={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #111",
              padding: "4px 0",
              gap: 6,
              minWidth: 220,
            }}>
              <input
                type="text"
                placeholder="Buscar..."
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: 13,
                  color: "#111",
                  fontFamily: font,
                  width: "100%",
                  background: "transparent",
                }}
              />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            {/* Account */}
            <LocalizedClientLink href="/account" style={{ color: "#111", display: "flex", alignItems: "center" }} data-testid="nav-account-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </LocalizedClientLink>

            {/* Cart */}
            <Suspense fallback={
              <LocalizedClientLink href="/cart" style={{ color: "#111", display: "flex", alignItems: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </LocalizedClientLink>
            }>
              <CartButton />
            </Suspense>
          </div>

        </div>
      </header>
    </div>
  )
}
