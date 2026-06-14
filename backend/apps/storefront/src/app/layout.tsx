import { getBaseURL } from "@lib/util/env"
import { Metadata, Viewport } from "next"
import "styles/globals.css"
import { Hanken_Grotesk, Anton } from "next/font/google"

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-hanken",
  display: "swap",
})

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: { default: "PowerOver Motorsports | Peças de Alta Performance", template: "%s | PowerOver Motorsports" },
  description: "Peças de alta performance para drift e track. Kits de ângulo, suspensão coilover, câmbios forjados para BMW E36 e Chevette. Fabricação nacional.",
  keywords: ["drift", "track day", "kit ângulo", "coilover", "BMW E36", "Chevette", "peças performance", "powerover"],
  openGraph: {
    title: "PowerOver Motorsports | Peças de Alta Performance",
    description: "Fabricação nacional. Peças para drift e track desenvolvidas em pista.",
    locale: "pt_BR",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#51c020",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-mode="light" className={`${hanken.variable} ${anton.variable}`}>
      <body style={{ fontFamily: "var(--font-hanken), 'Hanken Grotesk', sans-serif" }}>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
