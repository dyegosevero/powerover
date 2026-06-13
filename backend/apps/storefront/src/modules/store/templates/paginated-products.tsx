import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  q?: string
}

function filterByCarTag(products: any[], carFilter?: string): any[] {
  if (!carFilter || carFilter === "todos") return products
  return products.filter((p) => {
    const tags: string[] = (p.tags ?? []).map((t: any) => (t.value ?? t.name ?? "").toLowerCase())
    if (carFilter === "chevette") {
      // show: tagged "chevette" OR has no "bmw" tag
      return tags.includes("chevette") || !tags.includes("bmw")
    }
    if (carFilter === "bmw") {
      // show: tagged "bmw" OR has no "chevette" tag
      return tags.includes("bmw") || !tags.includes("chevette")
    }
    return true
  })
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  searchQuery,
  carFilter,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  searchQuery?: string
  carFilter?: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: carFilter && carFilter !== "todos" ? 100 : 12,
  }

  if (collectionId) queryParams["collection_id"] = [collectionId]
  if (categoryId) queryParams["category_id"] = [categoryId]
  if (productsIds) queryParams["id"] = productsIds
  if (sortBy === "created_at") queryParams["order"] = "created_at"
  if (searchQuery) queryParams["q"] = searchQuery

  const region = await getRegion(countryCode)

  if (!region) return null

  const {
    response: { products: allProducts },
  } = await listProductsWithSort({
    page: carFilter && carFilter !== "todos" ? 1 : page,
    queryParams,
    sortBy,
    countryCode,
  })

  const products = filterByCarTag(allProducts, carFilter)
  const count = products.length
  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  if (products.length === 0) {
    return (
      <div style={{ padding: "48px 0", textAlign: "center", color: "#999" }}>
        <p style={{ fontSize: 16, marginBottom: 8 }}>Nenhum produto encontrado.</p>
        {searchQuery && (
          <p style={{ fontSize: 13 }}>Tente outros termos ou <a href="./store" style={{ color: "#51c020" }}>veja todos os produtos</a>.</p>
        )}
      </div>
    )
  }

  return (
    <>
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 gap-x-5 gap-y-8"
        data-testid="products-list"
      >
        {products.map((p) => (
          <li key={p.id}>
            <ProductPreview product={p} region={region} countryCode={countryCode} />
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
