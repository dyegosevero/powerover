import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)

  try {
    const body = req.body as any

    logger.info(`MercadoPago webhook received: type=${body?.type} id=${body?.data?.id}`)

    if (body?.type !== "payment" || !body?.data?.id) {
      return res.status(200).json({ received: true })
    }

    // Import the workflow dynamically to avoid circular deps at startup
    const { processPaymentWorkflow } = await import("@medusajs/medusa/core-flows")

    await processPaymentWorkflow(req.scope).run({
      input: {
        action: "not_supported",
        data: {
          session_id: body.data.id?.toString(),
          amount: 0,
        },
      },
    })

    res.status(200).json({ received: true })
  } catch (error: any) {
    logger.error("MercadoPago webhook error:", error)
    res.status(200).json({ received: true })
  }
}
