import { defineStore } from 'pinia'
import { useMainStore } from '../main.store'
import { eCities } from './cities.endpoint'
import type { ICity } from "@/data/cities/cities.interface";
import {useAuthStore} from "@/data/auth/auth.store";
import { i18n } from '@/plugins/0/i18n.plugin'

export const useCitiesStore = defineStore({
  id: 'cities',
  state: () => {
    return {
      cities: [] as Array<ICity>,
      userCity: null as ICity | null,
      userCityName: '',
      loading: false,
    }
  },
  actions: {
    async getCities() {
      try {
        if (this.cities.length) return
        this.loading = true
        const { data }: { data: Array<ICity> } = await useApi({
          ...eCities.cities,
        })
        this.cities = [...data] as ICity[]
        this.getUserCity()
        return data
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
        throw error
      }
      finally {
        this.loading = false
      }
    },
    getUserCity() {
      const user = useAuthStore().user
      if (this.cities?.length) {
        const city = this.cities.find((c) => c.id === user?.cityId)
        if (city) {
          this.userCity = city
          this.userCityName = city.name
          return city.name
        }
      }
    }
  },
})
