import { INotificationModuleService, IOrderModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function orderShippedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; fulfillment_id?: string }>) {
  const notificationService: INotificationModuleService = container.resolve(Modules.NOTIFICATION)
  const orderService: IOrderModuleService = container.resolve(Modules.ORDER)

  const order: any = await orderService.retrieveOrder(data.id, {
    relations: ["customer", "fulfillments"],
  }).catch(() => null)

  if (!order?.customer?.email) return

  const fulfillment = order.fulfillments?.find((f: any) =>
    data.fulfillment_id ? f.id === data.fulfillment_id : true
  )

  await notificationService.createNotifications({
    to: order.customer.email,
    channel: "email",
    template: "order.shipment_created",
    data: { order, fulfillment },
  })
}

export const config: SubscriberConfig = {
  event: "order.shipment_created",
}
