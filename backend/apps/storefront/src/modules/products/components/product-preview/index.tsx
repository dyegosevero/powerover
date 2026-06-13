import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import AddToCartBtn from "./add-to-cart-btn"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
  countryCode,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  countryCode: string
}) {
  const { cheapestPrice } = getProductPrice({ product })

  const variants = product.variants ?? []
  const hasMultipleVariants = variants.length > 1
  const firstVariantId = variants[0]?.id

  const promoTag = (product.metadata?.promo_tag as string) ?? null

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <LocalizedClientLink href={`/products/${product.handle}`} style={{ textDecoration: "none", color: "inherit" }}>
        <div style={{ position: "relative" }}>
          {promoTag && (
            <div style={{
              position: "absolute", top: 10, left: 10, zIndex: 2,
              backgroundColor: "#51c020", color: "#fff",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", padding: "3px 8px",
            }}>
              {promoTag}
            </div>
          )}
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
        </div>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#111", lineHeight: 1.4 }}>
            {product.title}
          </span>
          <div style={{ flexShrink: 0 }}>
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </LocalizedClientLink>

      <AddToCartBtn
        variantId={firstVariantId}
        countryCode={countryCode}
        hasMultipleVariants={hasMultipleVariants}
        handle={product.handle ?? ""}
      />
    </div>
  )
}
