"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

// Labels for known metadata keys
const metadataLabels: Record<string, string> = {
  marca: "Marca",
  modelo: "Modelo do carro",
  ano: "Ano",
  aplicacao: "Aplicação",
  montagem: "Montagem",
  material_extra: "Material",
  observacoes: "Observações",
  compatibilidade: "Compatibilidade",
  garantia: "Garantia",
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Características",
      component: <CaracteristicasTab product={product} />,
    },
    {
      label: "Informações Técnicas",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Envio e Devoluções",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const CaracteristicasTab = ({ product }: ProductTabsProps) => {
  const meta = product.metadata as Record<string, string> | undefined

  // Collect rows from metadata (known labels first, then unknowns)
  const rows: { label: string; value: string }[] = []

  if (meta) {
    // Known keys first (in order)
    Object.entries(metadataLabels).forEach(([key, label]) => {
      if (meta[key]) rows.push({ label, value: String(meta[key]) })
    })
    // Any remaining unknown keys
    Object.entries(meta).forEach(([key, value]) => {
      if (!metadataLabels[key] && value) {
        rows.push({ label: key, value: String(value) })
      }
    })
  }

  if (rows.length === 0) {
    return (
      <div className="py-6 text-sm text-gray-400">
        Nenhuma característica cadastrada para este produto.
      </div>
    )
  }

  return (
    <div className="py-4">
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
              <td style={{ padding: "8px 0", width: "40%", fontSize: 13, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {row.label}
              </td>
              <td style={{ padding: "8px 0", fontSize: 13, color: "#111" }}>
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-small-regular py-6">
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {[
            { label: "Material", value: product.material },
            { label: "País de origem", value: product.origin_country },
            { label: "Tipo", value: product.type?.value },
            { label: "Peso", value: product.weight ? `${product.weight} g` : null },
            {
              label: "Dimensões",
              value:
                product.length && product.width && product.height
                  ? `${product.length}C × ${product.width}L × ${product.height}A mm`
                  : null,
            },
          ]
            .filter((row) => row.value)
            .map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "8px 0", width: "40%", fontSize: 13, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {row.label}
                </td>
                <td style={{ padding: "8px 0", fontSize: 13, color: "#111" }}>
                  {row.value}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {!product.material && !product.weight && !product.type && (
        <p className="text-sm text-gray-400">Nenhuma especificação técnica cadastrada.</p>
      )}
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">Entrega rápida</span>
            <p className="max-w-sm">
              Seu pedido será enviado em até 3 dias úteis após a confirmação do pagamento para todo o Brasil.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">Trocas facilitadas</span>
            <p className="max-w-sm">
              Recebeu algo diferente do esperado? Entre em contato e trocamos sem burocracia.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">Devoluções sem complicação</span>
            <p className="max-w-sm">
              Devolva o produto e reembolsamos integralmente. Sem perguntas — fazemos o máximo para garantir sua satisfação.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
