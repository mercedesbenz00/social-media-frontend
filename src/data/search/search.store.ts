import { defineStore } from 'pinia'
import { asyncScheduler, catchError, concatAll, EMPTY, filter, forkJoin, of, scheduled, tap } from 'rxjs'
import { usePersonsStore } from '@/data/persons/persons.store'
import { useGroupsStore } from '@/data/groups/groups.store'
import { usePostsStore } from '@/data/posts/posts.store'
import type { IPage } from '@/data/main.model'
import type { IGroup } from '@/data/groups/groups.interface'
import type { IPost } from '@/data/posts/posts.interface'
import type { IPerson } from '@/data/persons/persons.interface'
import { PostStates } from '@/data/posts/posts.interface'

export type TResult = [IPage<IPerson>, IPage<IGroup>, IPage<IPost>] | null
export type TResultMapped = { posts: IPage<IPost>; groups: IPage<IGroup>; people: IPage<IPerson> } | null

export const useSearchStore = defineStore({
  id: 'search',
  state: () => ({
    result: null as TResult,
    resultMapped: null as Partial<TResultMapped>,
    pageResult: null as TResult,
    pageResultMapped: null as Partial<TResultMapped>,
    loading: false,
    query: '',
    size: 5,
    abortControllers: [new AbortController()],
    abortIndex: 0,
  }),
  actions: {
    searchQuery(query) {
      return scheduled(
        [
          of(true),
          forkJoin([
            usePersonsStore().getAllPersons({ query, size: this.size }, this.abortControllers[this.abortIndex].signal, false),
            useGroupsStore().getGroups(
              {
                query,
                size: this.size,
              },
              undefined,
              this.abortControllers[this.abortIndex].signal
            ),
            usePostsStore().getPosts(
              { query, states: [PostStates.PUBLISHED] },
              { size: this.size, page: 0 },
              this.abortControllers[this.abortIndex].signal
            ),
          ]).pipe(catchError((error) => EMPTY)),
          of(false),
        ],
        asyncScheduler
      ).pipe(
        concatAll(),
        tap((val) => {
          if (typeof val === 'boolean') {
            if (val) {
              this.abortControllers.slice(0, -1).forEach((a) => a.abort())
              this.abortIndex++
              this.abortControllers.push(new AbortController())
              this.result = null
              this.resultMapped = {}
            }
            this.loading = val
          }
        }),
        filter((val) => val !== undefined && val !== null && typeof val !== 'boolean' && !val?.includes(undefined)),
        tap((val) => {
          this.result = val as TResult
          this.resultMapped = {}
          if (!this.result) return
          if (this.result[2]?.content?.length) this.resultMapped.posts = this.result[2]
          if (this.result[1]?.content?.length) this.resultMapped.groups = this.result[1]
          if (this.result[0]?.content?.length) this.resultMapped.people = this.result[0]
          this.query = query
        })
      )
    },
    setPageResult(redirect = true) {
      this.pageResult = this.result
      this.pageResultMapped = this.resultMapped
      if (redirect) useGlobals().$router.push(`/search?query=${this.query}`)
    },
  },
  getters: {
    noResult(): boolean {
      if (!this.loading && this.result) {
        return !this.result.reduce((acc, item) => acc + (item?.content?.length || 0), 0)
      }
      return false
    },
    noPageResult(): boolean {
      return !this.pageResult?.reduce((acc, item) => acc + (item?.content?.length || 0), 0)
    },
  },
})
