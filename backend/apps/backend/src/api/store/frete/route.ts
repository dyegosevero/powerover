import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

type MelhorEnvioServico = {
  id: number
  name: string
  price: string | null
  delivery_range: { min: number; max: number }
  custom_delivery_range: { min: number; max: number }
  company: { id: number; name: string; picture: string }
  error?: string
}

const ME_URL = "https://melhorenvio.com.br/api/v2/me/shipment/calculate"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const cep = (req.query.cep as string | undefined)?.replace(/\D/g, "")
  const productId = req.query.product_id as string | undefined

  if (!cep || cep.length !== 8) {
    return res.status(400).json({ error: "CEP inválido. Use o formato 00000-000." })
  }

  const token = process.env.MELHORENVIO_TOKEN
  const cepOrigem = process.env.MELHORENVIO_CEP_ORIGEM

  if (!token || !cepOrigem) {
    return res.status(500).json({ error: "Configuração de frete incompleta." })
  }

  try {
    const viaCepRes = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    const viaCepData = await viaCepRes.json() as any
    if (viaCepData.erro) {
      return res.status(404).json({ error: "CEP não encontrado." })
    }

    let peso = 0.3
    let altura = 5
    let largura = 15
    let comprimento = 20
    let valor = 100

    if (productId) {
      try {
        const query = req.scope.resolve("query")
        const { data: products } = await query.graph({
          entity: "product",
          fields: ["weight", "height", "width", "length", "variants.prices.amount"],
          filters: { id: productId },
        }) as any
        const p = products?.[0]
        if (p?.weight) peso = Math.max(0.1, p.weight / 1000)
        if (p?.height) altura = Math.max(2, p.height / 10)
        if (p?.width) largura = Math.max(11, p.width / 10)
        if (p?.length) comprimento = Math.max(16, p.length / 10)
        if (p?.variants?.[0]?.prices?.[0]?.amount) valor = p.variants[0].prices[0].amount / 100
      } catch { /* use defaults */ }
    }

    const meRes = await fetch(ME_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "PowerOver Motorsports (dyego@efkz.com.br)",
      },
      body: JSON.stringify({
        from: { postal_code: cepOrigem },
        to: { postal_code: cep },
        products: [{
          id: productId || "1",
          width: Math.ceil(largura),
          height: Math.ceil(altura),
          length: Math.ceil(comprimento),
          weight: peso,
          insurance_value: valor,
          quantity: 1,
        }],
        options: { receipt: false, own_hand: false },
      }),
    })

    if (!meRes.ok) {
      const errText = await meRes.text()
      console.error(`Melhor Envio error (${meRes.status}):`, errText)
      let detail = ""
      try { detail = JSON.parse(errText)?.message || errText } catch { detail = errText }
      return res.status(502).json({ error: "Erro ao consultar transportadoras.", detail })
    }

    const servicos: MelhorEnvioServico[] = await meRes.json()

    const opcoes = servicos
      .filter((s) => !s.error && s.price !== null)
      .sort((a, b) => parseFloat(a.price!) - parseFloat(b.price!))
      .map((s) => ({
        id: s.id,
        nome: `${s.company.name} ${s.name}`,
        empresa: s.company.name,
        logo: s.company.picture,
        prazo: s.custom_delivery_range
          ? `${s.custom_delivery_range.min} a ${s.custom_delivery_range.max} dias úteis`
          : `${s.delivery_range.min} a ${s.delivery_range.max} dias úteis`,
        preco: parseFloat(s.price!),
        preco_formatado: parseFloat(s.price!).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
      }))

    res.json({ cep, localidade: viaCepData.localidade, uf: viaCepData.uf, opcoes })
  } catch (error: any) {
    console.error("Frete route error:", error)
    res.status(500).json({ error: error.message || "Erro ao calcular frete." })
  }
}
