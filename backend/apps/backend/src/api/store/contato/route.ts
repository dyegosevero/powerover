import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { nome, email, telefone, mensagem } = req.body as any

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: "Nome, e-mail e mensagem são obrigatórios." })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: "Serviço de e-mail não configurado." })
  }

  try {
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#111;padding:20px 28px;text-align:center">
          <p style="margin:0;color:#51c020;font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase">PowerOver Motorsports</p>
        </div>
        <div style="padding:28px;background:#fff">
          <h2 style="color:#111;margin:0 0 20px;font-size:18px">Nova mensagem de contato</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:12px;color:#999;width:100px">Nome</td><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#111;font-weight:600">${nome}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:12px;color:#999">E-mail</td><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#111"><a href="mailto:${email}" style="color:#1a6eff">${email}</a></td></tr>
            ${telefone ? `<tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:12px;color:#999">Telefone</td><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#111">${telefone}</td></tr>` : ""}
            <tr><td style="padding:8px 0;font-size:12px;color:#999;vertical-align:top;padding-top:16px">Mensagem</td><td style="padding:8px 0;font-size:14px;color:#333;line-height:1.7;padding-top:16px">${mensagem.replace(/\n/g, "<br>")}</td></tr>
          </table>
        </div>
        <div style="background:#f9f9f9;padding:14px 28px;text-align:center;border-top:1px solid #eee">
          <p style="margin:0;font-size:11px;color:#999">Responda direto para <a href="mailto:${email}" style="color:#666">${email}</a></p>
        </div>
      </div>`

    const result = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "PowerOver Motorsports <noreply@powerover.com.br>",
        to: ["contato@powerover.com.br"],
        reply_to: email,
        subject: `Contato: ${nome} — PowerOver Motorsports`,
        html,
      }),
    })

    if (!result.ok) {
      const err = await result.text()
      console.error("Resend error:", err)
      return res.status(502).json({ error: "Erro ao enviar mensagem. Tente novamente." })
    }

    res.json({ success: true })
  } catch (err: any) {
    console.error("Contact route error:", err)
    res.status(500).json({ error: "Erro interno. Tente novamente." })
  }
}
