import { defineStore } from 'pinia'
import { eStickers } from './stickers.endpoint'
import type { ISticker, ISearchResults, ITrending, ICategories } from '@/data/stickers/stickers.interface'
import type { IPagination } from '@/data/main.model'
import axios from 'axios'

const useParams = (page: IPagination = { page: 0, size: 10 }) => {
  return {
    key: import.meta.env.APP_TONER_API_KEY,
    // client_key: 'social_media',
    limit: (page.size || 10).toString(),
    pos: (page.page || 0).toString(),
  }
}

export const useStickerStore = defineStore({
  id: 'stickers',
  state: () => {
    return {
      trending: null as ITrending | null,
      categories: null as ICategories | null,
      loading: false,
    }
  },
  actions: {
    async searchStickers(query: string, page?: IPagination, filter?: string) {
      try {
        this.loading = true
        const params = {
          ...useParams(page),
          media_filter: 'minimal',
          q: query.length ? query : null,
          searchfilter: filter
        }
        const { data } = await axios.get<ISearchResults>(eStickers.search.url, { params })
        return data
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    async searchCategories() {
      if (this.categories) {
        return this.categories
      }

      try {
        this.loading = true

        const params = {
          ...useParams(),
          type: 'trending',
        }
        const { data } = await axios.get<ICategories>(eStickers.searchCategories.url, { params })
        this.categories = data
        return data
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
  },
})
