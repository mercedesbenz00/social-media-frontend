import { defineStore } from 'pinia'
import { useMainStore } from '../main.store'
import { eTags } from './tags.endpoint'
import type { ITag } from "@/data/tags/tags.interface"
import {useRequest} from "@/composables/useRequest";
import type {IPage} from "@/data/main.model";
import { i18n } from '@/plugins/0/i18n.plugin'

export const useTagStore = defineStore({
  id: 'tags',
  state: () => {
    return {
      tags: {} as any,
      loading: false,
    }
  },
  actions: {
    async getAllTags() {
      try {
        if (this.tags.length) return this.tags
        this.loading = true
        const { data }: { data: any } = await useApi({
          ...eTags.tags,
        })
        this.tags = data
        return data
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
        throw error
      }
      finally {
        this.loading = false
      }
    },
    buildGetTagsRequest() {
      return useRequest<IPage<ITag>, {personId}>(
        {
          req: eTags.tags,
          onError: (error) => useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
        }
      )
    }
  },
})
