import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const code = (req.query.code as string | undefined)?.trim().toUpperCase()
  if (!code) return res.status(400).json({ error: "Código de rastreio obrigatório." })

  const token = process.env.MELHORENVIO_TOKEN
  if (!token) return res.status(500).json({ error: "Serviço de rastreio não configurado." })

  try {
    const meRes = await fetch(`https://melhorenvio.com.br/api/v2/me/shipment/tracking`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "PowerOver Motorsports (dyego@efkz.com.br)",
      },
      body: JSON.stringify({ orders: [code] }),
    })

    if (!meRes.ok) {
      // Fallback: Correios via API pública
      return await trackCorreios(code, res)
    }

    const data = await meRes.json() as any
    const order = data[code] || Object.values(data)[0] as any

    if (!order) return await trackCorreios(code, res)

    const events = (order.tracking || []).map((t: any) => ({
      description: t.description || t.status || "Atualização",
      date: t.date ? new Date(t.date).toLocaleDateString("pt-BR") : "",
      time: t.time || "",
      location: t.location || t.city || "",
    }))

    res.json({
      code,
      carrier: order.carrier || "",
      status: order.status || "",
      events,
    })
  } catch (err: any) {
    return await trackCorreios(code, res)
  }
}

async function trackCorreios(code: string, res: MedusaResponse) {
  try {
    // Correios API pública (sem auth)
    const r = await fetch(`https://api.linketrack.com/track/json?user=teste&token=1abcd00b2731640db0b88b75dec4d4934cf280c5&codigo=${code}`)
    if (!r.ok) throw new Error("not found")
    const data = await r.json() as any

    const events = (data.eventos || []).map((e: any) => ({
      description: e.descricao || e.status || "Atualização",
      date: e.data || "",
      time: e.hora || "",
      location: e.local ? `${e.local}${e.cidade ? ` — ${e.cidade}` : ""}` : "",
    }))

    res.json({
      code,
      carrier: "Correios",
      status: data.status || (events.length > 0 ? events[0].description : "Em trânsito"),
      events,
    })
  } catch {
    res.status(404).json({ error: "Código de rastreio não encontrado. Verifique o código e tente novamente." })
  }
}
