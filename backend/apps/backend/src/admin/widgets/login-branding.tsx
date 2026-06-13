import { defineWidgetConfig } from "@medusajs/admin-sdk"
// @ts-ignore
import logoUrl from "../logo-po.png"

const GREEN = "#7ac142"
const GREEN_DARK = "#69aa38"
const GREEN_LIGHT = "#8fce55"

const LoginBrandingWidget = () => {
  return (
    <>
      <style>{`
        /* ── Background ─────────────────────────────── */
        .bg-ui-bg-subtle {
          background: #0d0d0d !important;
        }

        /* ── Hide default Medusa avatar box ─────────── */
        .bg-ui-bg-subtle > div > a,
        .bg-ui-bg-subtle > div > div:first-child {
          display: none !important;
        }

        /* ── Headings & text ────────────────────────── */
        .bg-ui-bg-subtle h1 {
          color: #ffffff !important;
          font-size: 20px !important;
        }
        .bg-ui-bg-subtle .text-ui-fg-subtle {
          color: rgba(255,255,255,0.45) !important;
        }
        .text-ui-fg-muted {
          color: rgba(255,255,255,0.25) !important;
        }

        /* ── Inputs ─────────────────────────────────── */
        .bg-ui-bg-field-component {
          background: #1c1c1c !important;
          border-color: #2e2e2e !important;
          color: #fff !important;
        }
        .bg-ui-bg-field-component::placeholder {
          color: rgba(255,255,255,0.3) !important;
        }
        .bg-ui-bg-field-component:focus {
          border-color: ${GREEN} !important;
          box-shadow: 0 0 0 2px ${GREEN}33 !important;
        }

        /* ── Submit button ──────────────────────────── */
        button[type="submit"] {
          background: ${GREEN} !important;
          border-color: ${GREEN} !important;
          color: #fff !important;
          font-weight: 700 !important;
          letter-spacing: 0.03em !important;
        }
        button[type="submit"]:hover:not(:disabled) {
          background: ${GREEN_DARK} !important;
          border-color: ${GREEN_DARK} !important;
        }

        /* ── Links ──────────────────────────────────── */
        .text-ui-fg-interactive,
        a.text-ui-fg-interactive {
          color: ${GREEN} !important;
        }
        .hover\\:text-ui-fg-interactive-hover:hover {
          color: ${GREEN_LIGHT} !important;
        }

        /* ── Eye icon in password field ─────────────── */
        .bg-ui-bg-subtle svg {
          color: rgba(255,255,255,0.4) !important;
        }
      `}</style>

      {/* Logo + tagline */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        marginBottom: 20,
      }}>
        <img
          src={logoUrl}
          alt="PowerOver"
          style={{ height: 52, width: "auto" }}
        />
        <p style={{
          fontSize: 9,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.25)",
          margin: 0,
          fontWeight: 500,
        }}>
          Painel de Gestão
        </p>
      </div>
    </>
  )
}

export const config = defineWidgetConfig({
  zone: "login.before",
})

export default LoginBrandingWidget
