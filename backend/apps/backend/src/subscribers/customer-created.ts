import { INotificationModuleService, ICustomerModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function customerCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationService: INotificationModuleService = container.resolve(Modules.NOTIFICATION)
  const customerService: ICustomerModuleService = container.resolve(Modules.CUSTOMER)

  const customer = await customerService.retrieveCustomer(data.id).catch(() => null)

  if (!customer?.email) return

  await notificationService.createNotifications({
    to: customer.email,
    channel: "email",
    template: "customer.created",
    data: { customer },
  })
}

export const config: SubscriberConfig = {
  event: "customer.created",
}
