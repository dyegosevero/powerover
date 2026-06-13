import { Metadata } from "next"

import Hero from "@modules/home/components/hero"

export const metadata: Metadata = {
  title: "PowerOver Motorsports | Peças de Alta Performance",
  description: "Kits de ângulo, suspensão e câmbio para drift e track. BMW E36 e Chevette.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  return <Hero />
}
