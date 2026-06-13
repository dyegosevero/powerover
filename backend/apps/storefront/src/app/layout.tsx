import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import { Hanken_Grotesk, Anton } from "next/font/google"

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-hanken",
})

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={`${hanken.variable} ${anton.variable}`}>
      <body style={{ fontFamily: "var(--font-hanken), 'Hanken Grotesk', sans-serif" }}>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
