import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import FreteCalculator from "@modules/products/components/frete-calculator"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Breadcrumb from "@modules/common/components/breadcrumb"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const categoryLinks = [
  { label: "Drift", href: "/categories/drift" },
  { label: "Track", href: "/categories/track" },
  { label: "Preparação", href: "/categories/preparacao" },
  { label: "Peças Avulsas", href: "/store" },
]

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div
        className="py-8"
        data-testid="product-container"
        style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 40px" }}
      >
        <div className="flex gap-10">

          {/* ── Galeria de imagens ──────────────── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <ImageGallery images={images} />
          </div>

          {/* ── Coluna direita: título + preço + ações + frete + tabs + categorias ── */}
          <div style={{ width: 340, flexShrink: 0 }}>
            <div style={{ position: "sticky", top: 72 }}>

              {/* Título do produto */}
              <div style={{ marginBottom: 16 }}>
                {product.collection && (
                  <LocalizedClientLink
                    href={`/collections/${product.collection.handle}`}
                    style={{ fontSize: 11, color: "#999", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}
                  >
                    {product.collection.title}
                  </LocalizedClientLink>
                )}
                <h1 style={{
                  fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: "#111",
                  margin: "4px 0 0",
                }}>
                  {product.title}
                </h1>
                <Breadcrumb crumbs={[
                  { label: "Home", href: "/" },
                  { label: "Loja", href: "/store" },
                  ...(product.categories && product.categories.length > 0
                    ? [{ label: product.categories[0].name, href: `/categories/${product.categories[0].handle}` }]
                    : []),
                  { label: product.title },
                ]} />
                {product.description && (
                  <p style={{ fontSize: 13, color: "#777", marginTop: 8, lineHeight: 1.6 }}>
                    {product.description}
                  </p>
                )}
              </div>

              <ProductOnboardingCta />

              <Suspense
                fallback={
                  <ProductActions
                    disabled={true}
                    product={product}
                    region={region}
                  />
                }
              >
                <ProductActionsWrapper id={product.id} region={region} />
              </Suspense>

              {/* Cálculo de frete */}
              <FreteCalculator productId={product.id} />

              {/* Tabs de informação */}
              <div style={{ marginTop: 24 }}>
                <ProductTabs product={product} />
              </div>

              {/* Categorias — abaixo dos detalhes */}
              <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid #ececec" }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#999", marginBottom: 10 }}>
                  Categorias
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {categoryLinks.map((cat) => (
                    <LocalizedClientLink
                      key={cat.href}
                      href={cat.href}
                      style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#555",
                        border: "1px solid #ddd",
                        textDecoration: "none",
                        lineHeight: "20px",
                      }}
                    >
                      {cat.label}
                    </LocalizedClientLink>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
