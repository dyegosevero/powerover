import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  const pubKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

  const body = await req.json()

  const res = await fetch(`${backendUrl}/store/contato`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": pubKey,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
