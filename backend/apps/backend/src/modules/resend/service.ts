import { AbstractNotificationProviderService } from "@medusajs/framework/utils"
import {
  Logger,
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types"
import { Resend } from "resend"

type Options = {
  api_key: string
  from: string
}

export class ResendNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "resend"

  private resend: Resend
  private from: string
  private logger: Logger

  constructor({ logger }: { logger: Logger }, options: Options) {
    super()
    this.resend = new Resend(options.api_key)
    this.from = options.from || "PowerOver Motorsports <noreply@powerover.com.br>"
    this.logger = logger
  }

  async send(notification: ProviderSendNotificationDTO): Promise<ProviderSendNotificationResultsDTO> {
    const to = notification.to
    const template = notification.template
    const data: Record<string, any> = (notification.data as Record<string, any>) || {}
    const { subject, html } = this.renderTemplate(template, data)

    try {
      const result = await this.resend.emails.send({
        from: this.from,
        to,
        subject,
        html,
      })
      this.logger.info(`[Resend] Email enviado para ${to} — template: ${template}`)
      return { id: result.data?.id || "sent" }
    } catch (err: any) {
      this.logger.error(`[Resend] Erro ao enviar para ${to}: ${err.message}`)
      throw err
    }
  }

  private renderTemplate(template: string, data: Record<string, any>): { subject: string; html: string } {
    switch (template) {
      case "order.placed":
        return this.orderPlacedTemplate(data)
      case "order.shipment_created":
        return this.orderShippedTemplate(data)
      case "customer.created":
        return this.customerCreatedTemplate(data)
      case "order.canceled":
        return this.orderCanceledTemplate(data)
      case "auth.password_reset":
        return this.passwordResetTemplate(data)
      default:
        return {
          subject: "Notificação — PowerOver Motorsports",
          html: `<p>Olá! Você tem uma atualização da PowerOver Motorsports.</p>`,
        }
    }
  }

  // ─── Templates ───────────────────────────────────────────────

  private orderPlacedTemplate(data: any) {
    const { order } = data
    const items = (order?.items || [])
      .map((i: any) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${i.title || i.product_title}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${i.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">${formatPrice(i.unit_price)}</td>
        </tr>`)
      .join("")

    const total = formatPrice(order?.total || 0)
    const orderId = order?.display_id ? `#${order.display_id}` : order?.id?.slice(0, 8)
    const customerName = order?.customer?.first_name || "Cliente"

    return {
      subject: `✅ Pedido ${orderId} confirmado — PowerOver Motorsports`,
      html: baseTemplate(`
        <h2 style="margin:0 0 16px;color:#111;font-size:22px;">Pedido confirmado! 🏁</h2>
        <p style="margin:0 0 24px;color:#444;">Olá, <strong>${customerName}</strong>! Recebemos seu pedido e estamos preparando tudo.</p>

        <div style="background:#f9f9f9;border-radius:4px;padding:16px;margin-bottom:24px;">
          <p style="margin:0;font-size:13px;color:#999;text-transform:uppercase;letter-spacing:.08em;">Número do pedido</p>
          <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#111;">${orderId}</p>
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
          <thead>
            <tr style="background:#111;color:#fff;">
              <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:600;">Produto</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:600;">Qtd</th>
              <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:600;">Preço</th>
            </tr>
          </thead>
          <tbody>${items}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:12px;font-weight:700;text-align:right;font-size:15px;">Total</td>
              <td style="padding:12px;font-weight:700;text-align:right;font-size:15px;color:#51c020;">${total}</td>
            </tr>
          </tfoot>
        </table>

        <p style="color:#666;font-size:14px;">Assim que seu pedido for enviado, você receberá outro e-mail com o código de rastreio.</p>
        <p style="color:#666;font-size:14px;">Dúvidas? Responda este e-mail ou acesse <a href="https://loja.powerover.com.br/contato" style="color:#51c020;">loja.powerover.com.br/contato</a></p>
      `),
    }
  }

  private orderShippedTemplate(data: any) {
    const { order, fulfillment } = data
    const tracking = fulfillment?.tracking_numbers?.[0] || fulfillment?.tracking_links?.[0]?.tracking_number || "—"
    const orderId = order?.display_id ? `#${order.display_id}` : order?.id?.slice(0, 8)
    const customerName = order?.customer?.first_name || "Cliente"

    return {
      subject: `🚚 Pedido ${orderId} enviado! Rastreie agora`,
      html: baseTemplate(`
        <h2 style="margin:0 0 16px;color:#111;font-size:22px;">Seu pedido saiu! 🚀</h2>
        <p style="margin:0 0 24px;color:#444;">Olá, <strong>${customerName}</strong>! Seu pedido <strong>${orderId}</strong> foi enviado e está a caminho.</p>

        <div style="background:#111;border-radius:4px;padding:20px;margin-bottom:24px;text-align:center;">
          <p style="margin:0 0 4px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:.1em;">Código de rastreio</p>
          <p style="margin:0;font-size:24px;font-weight:700;color:#51c020;letter-spacing:.05em;">${tracking}</p>
        </div>

        <p style="color:#666;font-size:14px;text-align:center;">
          Rastreie em <a href="https://www.correios.com.br/rastreamento" style="color:#51c020;">correios.com.br</a> ou no app dos Correios.
        </p>
        <p style="color:#666;font-size:14px;text-align:center;">O prazo começa a contar a partir desta data. Qualquer problema, fale conosco!</p>
      `),
    }
  }

  private customerCreatedTemplate(data: any) {
    const { customer } = data
    const name = customer?.first_name || "Cliente"

    return {
      subject: `Bem-vindo à PowerOver Motorsports, ${name}! 🏎️`,
      html: baseTemplate(`
        <h2 style="margin:0 0 16px;color:#111;font-size:22px;">Conta criada com sucesso!</h2>
        <p style="margin:0 0 16px;color:#444;">Olá, <strong>${name}</strong>! Sua conta na PowerOver Motorsports está pronta.</p>
        <p style="margin:0 0 24px;color:#444;">Agora você pode acompanhar seus pedidos, salvar endereços e comprar com mais agilidade.</p>

        <div style="text-align:center;margin:32px 0;">
          <a href="https://loja.powerover.com.br/store"
             style="background:#51c020;color:#fff;padding:14px 32px;border-radius:4px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:.04em;">
            Ver produtos
          </a>
        </div>

        <p style="color:#999;font-size:13px;">Se não foi você que criou esta conta, ignore este e-mail.</p>
      `),
    }
  }

  private orderCanceledTemplate(data: any) {
    const { order } = data
    const orderId = order?.display_id ? `#${order.display_id}` : order?.id?.slice(0, 8)
    const customerName = order?.customer?.first_name || "Cliente"

    return {
      subject: `Pedido ${orderId} cancelado — PowerOver Motorsports`,
      html: baseTemplate(`
        <h2 style="margin:0 0 16px;color:#111;font-size:22px;">Pedido cancelado</h2>
        <p style="margin:0 0 16px;color:#444;">Olá, <strong>${customerName}</strong>. Seu pedido <strong>${orderId}</strong> foi cancelado.</p>
        <p style="margin:0 0 24px;color:#444;">Se o pagamento foi realizado, o estorno será processado em até 5 dias úteis conforme a forma de pagamento.</p>
        <p style="color:#666;font-size:14px;">Ficou com dúvidas? <a href="https://loja.powerover.com.br/contato" style="color:#51c020;">Entre em contato</a>.</p>
      `),
    }
  }

  private passwordResetTemplate(data: any) {
    const { token, email } = data
    const resetUrl = `https://loja.powerover.com.br/account?token=${token}&email=${encodeURIComponent(email)}`

    return {
      subject: `Redefinição de senha — PowerOver Motorsports`,
      html: baseTemplate(`
        <h2 style="margin:0 0 16px;color:#111;font-size:22px;">Redefinir sua senha</h2>
        <p style="margin:0 0 24px;color:#444;">Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo:</p>

        <div style="text-align:center;margin:32px 0;">
          <a href="${resetUrl}"
             style="background:#111;color:#fff;padding:14px 32px;border-radius:4px;text-decoration:none;font-weight:700;font-size:15px;">
            Redefinir senha
          </a>
        </div>

        <p style="color:#999;font-size:13px;">Este link expira em 24 horas. Se não foi você, ignore este e-mail — sua senha não será alterada.</p>
      `),
    }
  }
}

// ─── Helpers ──────────────────────────────────────────────────

function formatPrice(amount: number): string {
  return (amount / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
        <!-- Header -->
        <tr>
          <td style="background:#111;padding:24px 32px;text-align:center;">
            <p style="margin:0;color:#51c020;font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;">PowerOver Motorsports</p>
            <p style="margin:4px 0 0;color:#fff;font-size:11px;letter-spacing:.1em;opacity:.5;">Alta Performance · Drift · Track</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9f9f9;padding:20px 32px;border-top:1px solid #eee;text-align:center;">
            <p style="margin:0;font-size:12px;color:#999;">PowerOver Motorsports — Petrópolis, RJ</p>
            <p style="margin:4px 0 0;font-size:12px;color:#bbb;">
              <a href="https://loja.powerover.com.br" style="color:#51c020;text-decoration:none;">loja.powerover.com.br</a>
              &nbsp;·&nbsp;
              <a href="https://instagram.com/powerovermotorsport" style="color:#999;text-decoration:none;">@powerovermotorsport</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export default ResendNotificationProviderService
