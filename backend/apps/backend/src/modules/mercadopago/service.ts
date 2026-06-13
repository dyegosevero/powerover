import {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  IPaymentProvider,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/types"
import { AbstractPaymentProvider } from "@medusajs/utils"
import MercadoPagoConfig, { Payment, PaymentRefund, Preference } from "mercadopago"

type MercadoPagoOptions = {
  access_token: string
  webhook_secret?: string
}

type InjectedDependencies = {
  logger: { error: (...args: any[]) => void; info: (...args: any[]) => void }
}

class MercadoPagoProviderService extends AbstractPaymentProvider<MercadoPagoOptions> {
  static identifier = "mercadopago"

  protected readonly logger_: InjectedDependencies["logger"]
  protected readonly options_: MercadoPagoOptions
  protected mp_: MercadoPagoConfig
  protected payment_: Payment
  protected preference_: Preference

  constructor(
    { logger }: InjectedDependencies,
    options: MercadoPagoOptions
  ) {
    // @ts-ignore
    super(...arguments)
    this.logger_ = logger
    this.options_ = options

    this.mp_ = new MercadoPagoConfig({ accessToken: options.access_token })
    this.payment_ = new Payment(this.mp_)
    this.preference_ = new Preference(this.mp_)
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const { amount, currency_code, context } = input

    try {
      const sessionId = (input.data?.session_id as string) || "cart"

      const preference = await this.preference_.create({
        body: {
          items: [
            {
              id: sessionId,
              title: "Pedido PowerOver",
              quantity: 1,
              unit_price: Number(amount) / 100,
              currency_id: currency_code.toUpperCase(),
            },
          ],
          external_reference: sessionId,
          back_urls: {
            success: `${process.env.STORE_URL || "http://localhost:8000"}/order/confirmed`,
            failure: `${process.env.STORE_URL || "http://localhost:8000"}/cart`,
            pending: `${process.env.STORE_URL || "http://localhost:8000"}/cart`,
          },
          auto_return: "approved",
          notification_url: `${process.env.BACKEND_URL || "http://localhost:9000"}/hooks/payment/mercadopago`,
        },
      })

      return {
        id: preference.id!,
        data: {
          preference_id: preference.id,
          init_point: preference.init_point,
          sandbox_init_point: preference.sandbox_init_point,
        },
      }
    } catch (error: any) {
      this.logger_.error("MercadoPago initiatePayment error:", error)
      throw error
    }
  }

  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    const { data } = input
    const paymentId = data?.payment_id as string

    if (!paymentId) {
      return {
        data,
        status: "pending",
      }
    }

    try {
      const payment = await this.payment_.get({ id: Number(paymentId) })
      return {
        data: { ...data, mp_status: payment.status, payment_id: paymentId },
        status: this.getMedusaStatus(payment.status),
      }
    } catch (error: any) {
      this.logger_.error("MercadoPago authorizePayment error:", error)
      throw error
    }
  }

  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    return { data: input.data }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    const { data } = input
    const paymentId = data?.payment_id as string

    if (!paymentId) {
      return { data }
    }

    try {
      await this.payment_.cancel({ id: Number(paymentId) })
      return { data: { ...data, mp_status: "cancelled" } }
    } catch (error: any) {
      this.logger_.error("MercadoPago cancelPayment error:", error)
      throw error
    }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const { data, amount } = input
    const paymentId = data?.payment_id as string

    try {
      const refund = new PaymentRefund(this.mp_)
      await refund.create({
        payment_id: Number(paymentId),
        body: {
          amount: amount ? Number(amount) / 100 : undefined,
        },
      })
      return { data }
    } catch (error: any) {
      this.logger_.error("MercadoPago refundPayment error:", error)
      throw error
    }
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    const { data } = input
    const paymentId = data?.payment_id as string

    if (!paymentId) {
      return { data }
    }

    try {
      const payment = await this.payment_.get({ id: Number(paymentId) })
      return { data: { ...data, mp_payment: payment } }
    } catch (error: any) {
      this.logger_.error("MercadoPago retrievePayment error:", error)
      throw error
    }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    return this.initiatePayment(input)
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return this.cancelPayment(input)
  }

  async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    const { data } = input
    const paymentId = data?.payment_id as string

    if (!paymentId) {
      return { status: "pending" }
    }

    try {
      const payment = await this.payment_.get({ id: Number(paymentId) })
      return { status: this.getMedusaStatus(payment.status) }
    } catch {
      return { status: "error" }
    }
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const body = payload.rawData as any

    if (!body || body.type !== "payment" || !body.data?.id) {
      return { action: "not_supported" }
    }

    try {
      const payment = await this.payment_.get({ id: Number(body.data.id) })
      const externalRef = payment.external_reference

      switch (payment.status) {
        case "approved":
          return {
            action: "authorized",
            data: {
              session_id: externalRef || "",
              amount: Math.round((payment.transaction_amount || 0) * 100),
            },
          }
        case "cancelled":
        case "rejected":
          return {
            action: "failed",
            data: {
              session_id: externalRef || "",
              amount: Math.round((payment.transaction_amount || 0) * 100),
            },
          }
        default:
          return { action: "not_supported" }
      }
    } catch {
      return { action: "not_supported" }
    }
  }

  private getMedusaStatus(mpStatus?: string | null): GetPaymentStatusOutput["status"] {
    switch (mpStatus) {
      case "approved":
        return "authorized"
      case "pending":
      case "in_process":
      case "in_mediation":
        return "pending"
      case "rejected":
      case "cancelled":
      case "refunded":
      case "charged_back":
        return "error"
      default:
        return "pending"
    }
  }
}

export default MercadoPagoProviderService
