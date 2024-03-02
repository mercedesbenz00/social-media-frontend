import { defineStore } from 'pinia'
import { useMainStore } from '../main.store'
import { ePostCollection } from './postCollections.endpoint'
import { i18n } from '@/plugins/0/i18n.plugin'

export const usePostCollectionStore = defineStore({
  id: 'postCollections',
  state: () => {
    return {
      loading: false,
    }
  },
  actions: {
    async getPostCollections(params = {}) {
      try {
        this.loading = true
        const { data }: { data: any } = await useApi({
          ...ePostCollection.post_collections,
            params
        })
        return data
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
        throw error
      }
      finally {
        this.loading = false
      }
    },
  }
})
