import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Resend } from "resend"
import fs from "fs"
import path from "path"

const TEMPLATES_FILE = path.join(process.cwd(), "email-templates.json")

const DEFAULT_TEMPLATES: Record<string, { subject: string; html: string; label: string; description: string }> = {
  "order.placed": {
    label: "Pedido Confirmado",
    description: "Enviado ao cliente quando o pedido é realizado com sucesso.",
    subject: "✅ Pedido {{order_id}} confirmado — PowerOver Motorsports",
    html: `<h2>Pedido confirmado! 🏁</h2>
<p>Olá, <strong>{{customer_name}}</strong>! Recebemos seu pedido e estamos preparando tudo.</p>
<p><strong>Pedido:</strong> {{order_id}}</p>
<p><strong>Total:</strong> {{total}}</p>
<p>Assim que for enviado, você receberá o código de rastreio.</p>`,
  },
  "order.shipment_created": {
    label: "Pedido Enviado",
    description: "Enviado ao cliente quando você marca o pedido como enviado e adiciona o rastreio.",
    subject: "🚚 Pedido {{order_id}} enviado! Rastreie agora",
    html: `<h2>Seu pedido saiu! 🚀</h2>
<p>Olá, <strong>{{customer_name}}</strong>! Seu pedido <strong>{{order_id}}</strong> foi enviado.</p>
<p><strong>Código de rastreio:</strong> {{tracking_number}}</p>
<p>Rastreie em <a href="https://www.correios.com.br/rastreamento">correios.com.br</a>.</p>`,
  },
  "customer.created": {
    label: "Boas-vindas (Novo Cadastro)",
    description: "Enviado quando um novo cliente cria uma conta na loja.",
    subject: "Bem-vindo à PowerOver Motorsports, {{customer_name}}! 🏎️",
    html: `<h2>Conta criada com sucesso!</h2>
<p>Olá, <strong>{{customer_name}}</strong>! Sua conta está pronta.</p>
<p>Acesse a loja e confira nossos produtos: <a href="https://loja.powerover.com.br/store">loja.powerover.com.br</a></p>`,
  },
  "order.canceled": {
    label: "Pedido Cancelado",
    description: "Enviado ao cliente quando um pedido é cancelado.",
    subject: "Pedido {{order_id}} cancelado — PowerOver Motorsports",
    html: `<h2>Pedido cancelado</h2>
<p>Olá, <strong>{{customer_name}}</strong>. Seu pedido <strong>{{order_id}}</strong> foi cancelado.</p>
<p>Se houve pagamento, o estorno será processado em até 5 dias úteis.</p>`,
  },
  "auth.password_reset": {
    label: "Recuperação de Senha",
    description: "Enviado quando o cliente solicita redefinição de senha.",
    subject: "Redefinição de senha — PowerOver Motorsports",
    html: `<h2>Redefinir sua senha</h2>
<p>Clique no link abaixo para redefinir sua senha:</p>
<p><a href="{{reset_url}}">Redefinir senha</a></p>
<p>Este link expira em 24 horas.</p>`,
  },
}

function loadTemplates() {
  if (fs.existsSync(TEMPLATES_FILE)) {
    try {
      const saved = JSON.parse(fs.readFileSync(TEMPLATES_FILE, "utf-8"))
      // merge defaults with saved (defaults fill in missing templates)
      const result: typeof DEFAULT_TEMPLATES = {}
      for (const key of Object.keys(DEFAULT_TEMPLATES)) {
        result[key] = { ...DEFAULT_TEMPLATES[key], ...(saved[key] || {}) }
      }
      return result
    } catch {
      return DEFAULT_TEMPLATES
    }
  }
  return DEFAULT_TEMPLATES
}

function saveTemplates(templates: typeof DEFAULT_TEMPLATES) {
  fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(templates, null, 2), "utf-8")
}

// GET /admin/email-templates → listar todos
export const GET = async (_req: MedusaRequest, res: MedusaResponse) => {
  const templates = loadTemplates()
  res.json({ templates })
}

// PUT /admin/email-templates → salvar template
export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id, subject, html } = req.body as any
  if (!id || !subject || !html) {
    return res.status(400).json({ error: "id, subject e html são obrigatórios" })
  }

  const templates = loadTemplates()
  if (!templates[id]) {
    return res.status(404).json({ error: "Template não encontrado" })
  }

  templates[id] = { ...templates[id], subject, html }
  saveTemplates(templates)

  res.json({ success: true, template: templates[id] })
}

// POST /admin/email-templates/test → enviar e-mail de teste
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id, to } = req.body as any
  if (!id || !to) {
    return res.status(400).json({ error: "id e to são obrigatórios" })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: "RESEND_API_KEY não configurado" })
  }

  const templates = loadTemplates()
  const template = templates[id]
  if (!template) {
    return res.status(404).json({ error: "Template não encontrado" })
  }

  // Substituir variáveis por valores de exemplo
  const exampleVars: Record<string, string> = {
    "{{customer_name}}": "João Silva",
    "{{order_id}}": "#PO-001",
    "{{total}}": "R$ 1.990,00",
    "{{tracking_number}}": "AA123456789BR",
    "{{reset_url}}": "https://loja.powerover.com.br/account?token=exemplo",
  }

  let html = template.html
  let subject = template.subject
  for (const [key, val] of Object.entries(exampleVars)) {
    html = html.replaceAll(key, val)
    subject = subject.replaceAll(key, val)
  }

  // Wrap in base layout
  const fullHtml = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:8px;overflow:hidden;">
        <tr><td style="background:#111;padding:24px 32px;text-align:center;">
          <p style="margin:0;color:#51c020;font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;">PowerOver Motorsports</p>
        </td></tr>
        <tr><td style="padding:32px;">${html}</td></tr>
        <tr><td style="background:#f9f9f9;padding:16px 32px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#999;">⚡ E-mail de teste — PowerOver Motorsports</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

  try {
    const resend = new Resend(apiKey)
    const result = await resend.emails.send({
      from: "PowerOver Motorsports <noreply@powerover.com.br>",
      to,
      subject: `[TESTE] ${subject}`,
      html: fullHtml,
    })
    res.json({ success: true, id: result.data?.id })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
