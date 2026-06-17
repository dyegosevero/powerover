import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Loja | PowerOver Motorsports",
  description: "Peças e produtos para drift e track.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    q?: string
    car?: string
    price_min?: string
    price_max?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page, q, car, price_min, price_max } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      searchQuery={q}
      carFilter={car}
      priceMin={price_min ? Number(price_min) : undefined}
      priceMax={price_max ? Number(price_max) : undefined}
    />
  )
}
