import { defineStore } from 'pinia'
import { eGroupPostCollections } from './groupPostCollections.endpoint'

export const useGroupPostCollectionsStore = defineStore({
  id: 'groupPostCollections',
  state: () => {
    return {
      loading: false,
    }
  },
  actions: {
    async createGroupPostCollections(payload: { defaultCollection: boolean; groupId: number; name: string }) {
      try {
        this.loading = true
        const { data } = await useApi({
          ...eGroupPostCollections.createGroupPostCollections,
          body: payload,
        })
        return data
      } finally {
        this.loading = false
      }
    },
    async getGroupPostCollections(params = {}) {
      try {
        this.loading = true
        const { data } = await useApi({
          ...eGroupPostCollections.getGroupPostCollections,
          params,
        })
        return data
      } finally {
        this.loading = false
      }
    },
    async addPostToGroupCollection(groupCollectionId, postId) {
      try {
        this.loading = true

        const { data } = await useApi(eGroupPostCollections.addPostToGroupCollection, {
          groupCollectionId,
          postId,
        })
        return data
      } finally {
        this.loading = false
      }
    },
  },
})
