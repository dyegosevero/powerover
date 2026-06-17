import { INotificationModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function passwordResetHandler({
  event: { data },
  container,
}: SubscriberArgs<{ email: string; token: string; actor_type: string }>) {
  // só para clientes da loja, não admin
  if (data.actor_type !== "customer") return

  const notificationService: INotificationModuleService = container.resolve(Modules.NOTIFICATION)

  await notificationService.createNotifications({
    to: data.email,
    channel: "email",
    template: "auth.password_reset",
    data: { email: data.email, token: data.token },
  })
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}
