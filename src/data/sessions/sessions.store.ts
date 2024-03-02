import { defineStore } from 'pinia'
import { eSessions } from './sessions.endpoint'
import type { IWorkspace, IWorkSpaceResponse } from '@/data/sessions/sessions.interface'

const workspaceIdLsK = 'workspaceIdLsK'

export const useSessionStore = defineStore({
  id: 'sessions',
  state: () => {
    return {
      workspaces: null as IWorkspace[] | null,
      currentWorkspaceId: localStorage.getItem(workspaceIdLsK) as string | null,
    }
  },
  actions: {
    async getWorkspaces(filter = {}): Promise<IWorkSpaceResponse> {
      const { data } = await useApi<IWorkSpaceResponse>({
        ...eSessions.workspace,
        params: { ...filter },
      })
      this.workspaces = data.workspaces
      if (!this.currentWorkspaceId) {
        this.currentWorkspaceId = data.workspaces[0]?.id
      }
      return data
    },
    setCurrentWorkspaceId(id: string): void {
      this.currentWorkspaceId = id
      localStorage.setItem(workspaceIdLsK, id)
    },
  },
  getters: {
    currentWorkspace(): IWorkspace | null | undefined {
      if (!this.workspaces?.length || !this.currentWorkspaceId) return null
      return this.workspaces.find((w) => w.id === this.currentWorkspaceId)
    },
  },
})
