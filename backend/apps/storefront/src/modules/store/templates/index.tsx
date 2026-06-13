import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import Breadcrumb from "@modules/common/components/breadcrumb"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { listCategories } from "@lib/data/categories"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  searchQuery,
  carFilter,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  searchQuery?: string
  carFilter?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const categories = await listCategories()

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} categories={categories} />
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-2xl-semi" data-testid="store-page-title">
            {searchQuery ? `Resultados para "${searchQuery}"` : "Todos os produtos"}
          </h1>
          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "Loja" },
          ]} />
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            searchQuery={searchQuery}
            carFilter={carFilter}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
