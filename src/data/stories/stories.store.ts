/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineStore } from 'pinia'
import { useMainStore } from '../main.store'
import { eStories } from './stories.endpoint'
import { i18n } from '@/plugins/0/i18n.plugin'
import type { IStory } from './stories.interface'
import { get } from 'lodash'

export const useStoriesStore = defineStore({
  id: 'stories',
  state: () => {
    return {
      stories: [] as IStory[],
    }
  },
  actions: {
    async postStory(file: Blob) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        const { data } = await useApi({
          url: eStories.stories.url,
          method: 'post',
          body: formData,
        })
        useMainStore().toast({ type: 'success', message: i18n('stories.success'), detail: i18n('toast.success') })
        this.getStories()
      } catch (error) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: get(error, 'response.data.message'),
        })
      }
    },
    async getStories(params = {}) {
      const unseenOnly = { unseenOnly: true }
      params = { ...params, ...unseenOnly }
      const { data } = await useApi({ ...eStories.stories, params })
      this.stories = data.content
      return data
    },
    async seenStories(id: number) {
      const { data } = await useApi({
        url: `${eStories.stories.url}/${id}/views`,
        method: 'put',
      })
    },
  },
  getters: {},
})
