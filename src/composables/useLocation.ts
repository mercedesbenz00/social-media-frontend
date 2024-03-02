import { useCitiesStore } from "@/data/cities/cities.store"

export function useLocation(cityId: number) {
  const { cities } = useCitiesStore()
  if (cities?.length) {
    const city = cities.filter((c) => c.id === cityId)
    if (city.length) {
      return city[0].name
    }
  }
  return cityId
}
