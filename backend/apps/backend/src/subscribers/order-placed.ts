import { INotificationModuleService, IOrderModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationService: INotificationModuleService = container.resolve(Modules.NOTIFICATION)
  const orderService: IOrderModuleService = container.resolve(Modules.ORDER)

  const order: any = await orderService.retrieveOrder(data.id, {
    relations: ["items", "customer", "shipping_address"],
  }).catch(() => null)

  if (!order?.customer?.email) return

  await notificationService.createNotifications({
    to: order.customer.email,
    channel: "email",
    template: "order.placed",
    data: { order },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
