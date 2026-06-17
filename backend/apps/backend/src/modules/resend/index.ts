import { ModuleProviderExports } from "@medusajs/framework/types"
import ResendNotificationProviderService from "./service"

const services: ModuleProviderExports = {
  services: [ResendNotificationProviderService],
}

export default services
