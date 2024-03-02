/* eslint-disable @typescript-eslint/no-unused-vars */
import { get, find } from 'lodash'
import { defineStore } from 'pinia'
import type { IPost, IPostData, PostSearchCriteria, IComment, IVoteData, ICollection, IComplaintItem } from './posts.interface'
import { ePosts } from './posts.endpoint'
import { usePersonsStore } from '../persons/persons.store'
import type { IPage, IPagination } from '@/data/main.model'
import { PAGE_SORT_ORDER } from '@/data/main.model'
import { toGenericPageParams } from '@/data/main.utils'
import { useAuthStore } from '@/data/auth/auth.store'
import { PostStates } from './posts.interface'
import { useMainStore } from '@/data/main.store'
import { Subject } from 'rxjs'
import { i18n } from '@/plugins/0/i18n.plugin'

export type TPostSearchBy = { criteria?: Partial<PostSearchCriteria>; pagination?: Partial<IPagination> }
interface IPostFooter {
  upvotesTotal?: number
  downvotesTotal?: number
  voteValue?: number
  commentsCount: number
}
interface ICommentFooter {
  totalVotes: IVoteData
  createdAt: number
  modifiedAt?: number
  replyCommentsCount: number
}
export const usePostsStore = defineStore({
  id: 'posts',
  state: () => {
    return {
      post: {} as IPost,
      posts: [] as Array<IPost>,
      postFooters: {} as { [id: number]: IPostFooter },
      comments: {} as { [id: number]: IComment[] },
      totalComments: {} as { [id: number]: number },
      replies: {} as { [id: number]: IComment[] },
      totalReplies: {} as { [id: number]: number },
      commentFooters: {} as { [id: number]: ICommentFooter },
      loading: false,
      refresh$: new Subject<undefined | TPostSearchBy>(),
      postComplaintItems: {} as IPage<IComplaintItem>,
      promiseMap: {},
      collections: {} as IPage<ICollection>
    }
  },
  actions: {
    async getPosts(
      criteria: PostSearchCriteria,
      page?: IPagination,
      signal?: AbortSignal
    ): Promise<IPage<IPost> | undefined> {
      const params = toGenericPageParams({
        page: 0,
        size: 20,
        sortBy: 'createdAt',
        sortOrder: PAGE_SORT_ORDER.DESC,
        ...page,
      })
      if (criteria.subscribed) params.subscribed = criteria.subscribed.toString()
      if (criteria.authorIds) params.authorIds = criteria.authorIds.join(',')
      if (criteria.postIds && criteria.postIds.length > 0) params.postIds = criteria.postIds.join(',')
      if (criteria.query) params.query = criteria.query
      if (criteria.groupIds && criteria.groupIds.length > 0) params.groupIds = criteria.groupIds.join(',')
      if (criteria.postType) params.postType = criteria.postType
      if (criteria.sortType) params.sortType = criteria.sortType.toUpperCase()
      if (criteria.likedByPersons && criteria.likedByPersons.length > 0)
        params.likedByPersons = criteria.likedByPersons.join(',')
      if (criteria.states && criteria.states.length > 0) params.states = criteria.states.join(',')
      if (criteria.pinned) params.pinned = criteria.pinned.toString()
      if (criteria.sort) params.sort = criteria.sort.toString().replaceAll(' ', '')
      try {
        this.loading = true
        if (params.groupIds) {
          let needPinPost = false

          if (criteria.states && criteria.states.length) {
            needPinPost = !!criteria.states.find((state) => state === PostStates.PUBLISHED)
          }
          if (needPinPost) {
            const [posts, pinned] = await Promise.all([
              useApi({ ...ePosts.getPosts, params }, { signal }),
              useApi({ ...ePosts.getPosts, params: { pinned: true, groupIds: criteria.groupIds, states: 'PUBLISHED' } }),
            ])
            this.posts = [...pinned.data.content, ...posts.data.content, ...this.posts]
            posts.data.content = [...pinned.data.content, ...posts.data.content]
            return posts.data
          } else {
            const { data } = await useApi<IPage<IPost>>({ ...ePosts.getPosts, params }, { signal })
            this.posts = [...data.content, ...this.posts]
            return data
          }
        } else {
          const { data } = await useApi<IPage<IPost>>({ ...ePosts.getPosts, params }, { signal })
          this.posts = [...data.content, ...this.posts]
          return data
        }
      } catch (error) {
        if (error.name !== 'CanceledError') {
          useMainStore().toast({
            type: 'error',
            message: i18n('toast.error'),
            detail: get(error, 'response.data.message'),
          })

          throw error
        }
      } finally {
        this.loading = false
      }
    },
    async getCommentsWithComplaints(params = {}) {
      try {
        const { data } = await useApi({ ...ePosts.getCommentsWithComplaints, params })
        return data
      } catch (error) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: get(error, 'response.data.message'),
        })
      }
    },
    async getPostsWithComplaints(params = {}) {
      try {
        const { data } = await useApi({ ...ePosts.getPostsWithComplaints, params })
        return data
      } catch (error) {
        useMainStore().toast({
          type: 'error',
          message: i18n('toast.error'),
          detail: get(error, 'response.data.message'),
        })
      }
    },
    async getPostByGroupIds(paginationParams?: IPagination, criteria?: PostSearchCriteria, postsSortOrder = 'NEWEST') {
      // TODO: we need to add a parameter to state ovnership on feed post
      return await this.getPosts(
        { subscribed: true, states: [PostStates.PUBLISHED], sortType: postsSortOrder, ...criteria },
        paginationParams
      )
    },
    initilizePostFooter(postId: number, payload: IPostFooter) {
      if (this.postFooters[postId]) return
      this.postFooters[postId] = payload
    },
    async getPost(postId: number) {
      try {
        const { data } = await useApi({
          url: `${ePosts.getPosts.url}/${postId}`,
          method: 'get',
        })
        data.author = await usePersonsStore().getPersonById(data.authorId)
        this.post = data
        return data
      } catch (e) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: e.response.data.message })
        throw e
      } finally {
        this.loading = false
      }
    },
    async editComment(
      payload: { content: string; mentionedPersonIds?: Array<number>; commentId: number; commentUuid: string },
      postId: number,
      file?: File
    ) {
      try {
        const comment = this.comments[postId].find((c) => c.commentUuid == payload.commentUuid)
        const form = new FormData()
        const jsonPayload = new Blob([JSON.stringify(payload)], { type: 'application/json' })
        form.append('data', jsonPayload)
        if (file) form.append('file', file, 'file.upload')
        if (!file && comment?.file) await this.deleteCommentMedia(payload.commentUuid)
        const { data } = await useApi<any>({ ...ePosts.editComment, data: form }, { commentId: payload.commentUuid })
        useMainStore().toast({ type: 'success', message: i18n('toast.success') })
        return data
      } catch (e) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: e.response.data.message })
        throw e
      }
    },
    async deleteCommentMedia(uuid: string) {
      const url = ePosts.deleteCommentMedia.url.replace('{commentUuid}', uuid)
      await useApi({ ...ePosts.deleteCommentMedia, url })
    },
    async postComment(
      payload: { content: string; mentionedPersonIds?: Array<number>; postId: number; postUuid: string },
      file?: File
    ) {
      const form = new FormData()
      const jsonPayload = new Blob([JSON.stringify(payload)], { type: 'application/json' })
      form.append('data', jsonPayload)
      if (file) form.append('file', file, 'file.upload')
      try {
        const { data } = await useApi({ ...ePosts.postComment, data: form })
        this.initilizeCommentFooter(data.commentUuid, {
          createdAt: data.createdAt,
          modifiedAt: data.modifiedAt,
          totalVotes: data.totalVotes,
          replyCommentsCount: data.replyCommentsCount,
        })
        data.author = useAuthStore().user
        const t = { ...this.postFooters[payload.postId] }
        t.commentsCount = (t.commentsCount ?? 0) + 1
        this.postFooters[payload.postId] = t
        this.comments[payload.postId] = [data, ...(this.comments[payload.postId] ?? [])]
        return data
      } catch (e) {
        if (!navigator?.onLine) {
          useMainStore().toast({
            type: 'error',
            additionalType: 'comment',
            message: i18n('toast.comment_title_error'),
            detail: i18n('toast.comment_desc_error'),
            life: 10000,
            retryFunc: () => {
              this.postComment(payload, file)
            }
          })
        } else {
          useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: e.response.data?.message ?? i18n('toast.error') })
        }
        throw e
      }
    },
    async removeComment(payload: { uuid: string; postId?: number; replyTo?: string }) {
      try {
        const { data } = await useApi({ ...ePosts.removeComment }, { commentId: payload.uuid })
        if (payload.postId) {
          this.comments[payload.postId] = this.comments[payload.postId].filter(
            (comment) => comment.commentUuid !== payload.uuid
          )
          this.postFooters[payload.postId].commentsCount -= 1
        }
        if (payload.replyTo) {
          this.replies[payload.replyTo] = this.replies[payload.replyTo].filter(
            (reply) => reply.commentUuid !== payload.uuid
          )
          this.commentFooters[payload.replyTo].replyCommentsCount -= 1
        }
        useMainStore().toast({ type: 'success', message: i18n('toast.success') })
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },

    async getCommentById(payload: { uuid: string; post?: IPost; comment?: IComment }) {
      try {
        const { data } = await useApi(ePosts.getComment, { commentId: payload.uuid })

        if (data) {
          this.initilizeCommentFooter(data.commentUuid, {
            createdAt: data.createdAt,
            modifiedAt: data.modifiedAt,
            totalVotes: data.totalVotes,
            replyCommentsCount: data.replyCommentsCount,
          })
        }
        if (payload.post) {
          this.comments[payload.post.id] = [data]
          this.totalComments[payload.post.id] = payload.post.commentsCount ?? 0
        }
        if (payload.comment) {
          this.replies[payload.comment.commentUuid] = [data]
          this.totalReplies[payload.comment.commentUuid] = payload.comment.replyCommentsCount ?? 0
        }
        return data
      } catch (error) {
        if (error.response.status === 404)
          useMainStore().toast({
            type: 'error',
            message: i18n('toast.error'),
            detail: i18n('toast.comment_was_deleted'),
          })
        else useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },
    async getComments(post: IPost, forceRequest = false, page = 0, size = 3) {
      const postId = post.id
      if (this.comments[postId] && !forceRequest) return this.comments[postId]
      if (this.comments[postId]?.length > size) size = this.comments[postId].length
      const url = ePosts.getComments.url.replace('v1', 'v2')
      const { data } = await useApi({
        url: url,
        params: { ...{ page, size }, sort: 'createdAt,desc', postId: postId, postUuid: post.postUuid },
        method: 'get',
      })
      if (data && data.content) {
        data.content.forEach((e: IComment) => {
          this.initilizeCommentFooter(e.commentUuid, {
            createdAt: e.createdAt,
            modifiedAt: e.modifiedAt,
            totalVotes: e.totalVotes,
            replyCommentsCount: e.replyCommentsCount,
          })
        })
        this.comments[postId] = [...data.content]
        this.totalComments[postId] = data.totalElements
        return data.content
      }
    },
    async getMoreComments(post: IPost) {
      const current = this.comments[post.id]
      const postId = post.id
      if (!current) return await this.getComments(post)
      if ((post.commentsCount ?? 0) <= current.length) return current
      const newSize = current.length + 10 > (post?.commentsCount ?? 0) ? -1 : current.length + 10
      const url = ePosts.getComments.url.replace('v1', 'v2')
      const { data } = await useApi({
        url: url,
        params: { size: newSize, sort: 'createdAt,desc', postId: postId, postUuid: post.postUuid },
        method: 'get',
      })
      if (data && data.content) {
        data.content.forEach((e: IComment) => {
          this.initilizeCommentFooter(e.commentUuid, {
            createdAt: e.createdAt,
            modifiedAt: e.modifiedAt,
            totalVotes: e.totalVotes,
            replyCommentsCount: e.replyCommentsCount,
          })
        })
        this.comments[postId] = [...data.content]
        this.totalComments[postId] = data.totalElements
        return data.content
      }
    },
    initilizeCommentFooter(commentUuid: string, payload: ICommentFooter) {
      if (this.commentFooters[commentUuid]) return
      const t = payload
      if (!payload.totalVotes) t.totalVotes = { downvotesTotal: 0, upvotesTotal: 0, voteValue: 0, id: 0 }
      this.commentFooters[commentUuid] = t
    },
    async getReplies(comment: IComment, forceRequest = false) {
      try {
        if (!forceRequest) if (this.replies[comment.commentUuid]) return this.replies[comment.commentUuid]
        const url = ePosts.getComments.url.replace('v1', 'v2')
        const { data } = await useApi({
          url: `${url}/${comment.commentUuid}/replies`,
          params: { size: 3, page: 0, sort: 'createdAt,desc' },
          method: 'get',
        })
        if (data && data.content) {
          data.content.forEach((e: IComment) => {
            this.initilizeCommentFooter(e.commentUuid, {
              createdAt: e.createdAt,
              modifiedAt: e.modifiedAt,
              totalVotes: e.totalVotes,
              replyCommentsCount: e.replyCommentsCount,
            })
          })
          this.replies[comment.commentUuid] = [...data.content]
          this.totalReplies[comment.commentUuid] = data.totalElements
          return data.content
        }
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
        this.getComments(this.post, true)
      }
    },
    async postReply(
      payload: {
        content: string
        mentionedPersonIds?: Array<number>
        commentUuid: string
      },
      file?: File
    ) {
      try {
        const form = new FormData()
        const jsonPayload = new Blob([JSON.stringify(payload)], { type: 'application/json' })
        form.append('data', jsonPayload)
        if (file) form.append('file', file, 'file.upload')
        const { data } = await useApi(
          { ...ePosts.postReply, data: form },
          {
            commentId: payload.commentUuid,
          }
        )
        this.initilizeCommentFooter(data.commentUuid, {
          createdAt: data.createdAt,
          modifiedAt: data.modifiedAt,
          totalVotes: data.totalVotes,
          replyCommentsCount: data.replyCommentsCount,
        })
        data.author = useAuthStore().user
        const t: ICommentFooter = { ...this.commentFooters[payload.commentUuid] }
        t.replyCommentsCount = (t.replyCommentsCount ?? 0) + 1
        this.commentFooters[payload.commentUuid] = t
        this.replies[payload.commentUuid] = [data, ...(this.replies[payload.commentUuid] ?? [])]
        return data
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },
    async getMoreReplies(comment: IComment) {
      const current = this.replies[comment.commentUuid]
      if (!current) return await this.getReplies(comment)
      if ((comment.replyCommentsCount ?? 0) <= current.length) return current
      const newSize = current.length + 10 > (comment.replyCommentsCount ?? 0) ? -1 : current.length + 10

      const { data } = await useApi({
        url: `${ePosts.getComments.url}/${comment.commentUuid}/replies`,
        params: { size: newSize, sort: 'createdAt,desc' },
        method: 'get',
      })
      if (data && data.content) {
        data.content.forEach((e: IComment) => {
          this.initilizeCommentFooter(e.commentUuid, {
            createdAt: e.createdAt,
            modifiedAt: e.modifiedAt,
            totalVotes: e.totalVotes,
            replyCommentsCount: e.replyCommentsCount,
          })
        })
        this.replies[comment.commentUuid] = [...data.content]
        this.totalReplies[comment.commentUuid] = data.totalElements
        return data.content
      }
    },

    async updateVoteForComment(commentUuid: string, voteType: 'UPVOTE' | 'DOWNVOTE') {
      const current = this.commentFooters[commentUuid]
      if (
        (current.totalVotes.voteValue == 1 && voteType === 'UPVOTE') ||
        (current.totalVotes.voteValue == 2 && voteType === 'DOWNVOTE')
      ) {
        const { data } = await useApi({ ...ePosts.deleteVote }, { commentId: commentUuid })
        this.commentFooters[commentUuid] = { ...this.commentFooters[commentUuid], totalVotes: data }
      } else {
        const { data } = await useApi({ ...ePosts.vote }, { commentId: commentUuid, voteType })
        this.commentFooters[commentUuid] = { ...this.commentFooters[commentUuid], totalVotes: data }
      }
    },

    async updateVote(postId: number, voteType: string) {
      const { data } = await useApi({
        url: `${ePosts.getPosts.url}/${postId}/votes/${voteType}`,
        method: 'put',
      })
      this.postFooters[postId] = { ...this.postFooters[postId], ...data }

      return data
    },
    async removeVote(postId: number) {
      const { data } = await useApi({
        url: `${ePosts.getPosts.url}/${postId}/votes`,
        method: 'delete',
      })
      this.postFooters[postId] = { ...this.postFooters[postId], ...data }

      return data
    },

    async createPost(data: IPostData, files?: File[] | null) {
      const form = new FormData()
      const jsonPayload = new Blob([JSON.stringify(data)], { type: 'application/json' })
      form.append('data', jsonPayload)
      if (files) {
        files.forEach((file, idx) => {
          form.append('files', file, `file_${idx}.upload`)
        })
      }
      try {
        const { data } = await useApi<IPost>({ ...ePosts.createPost, data: form })
        useMainStore().toast({ type: 'success', message: i18n('toast.success'), detail: i18n(`toast.${data.stateDisplayName.toLowerCase()}`) })
        return data
      } catch (e) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: e.response.data.message })
        throw e
      }
    },
    async removePost(postId: number) {
      try {
        this.loading = true
        const { data } = await useApi({
          url: `${ePosts.removePost.url}/${postId}`,
          method: `${ePosts.removePost.method}`,
        })
        this.post = data
        useMainStore().toast({ type: 'success', message: i18n('toast.success'), detail: i18n('toast.remove_post') })
      } catch (e) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: e.response.data.message })
        throw e
      } finally {
        this.loading = false
      }
    },
    async removePostComplaints(postId: number) {
      try {
        const params = {
          reason: 'Rejected by Admin',
        }
        await useApi({ ...ePosts.removePostComplaints, params }, { postId })
        useMainStore().toast({
          type: 'success',
          message: i18n('toast.success'),
          detail: i18n('toast.remove_complaints'),
        })
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
        throw error
      }
    },
    async removeCommentComplaints(commentUuid: string) {
      try {
        const params = {
          reason: 'Rejected by Admin',
        }
        await useApi({ ...ePosts.removeCommentComplaints, params }, { commentUuid })
        useMainStore().toast({
          type: 'success',
          message: i18n('toast.success'),
          detail: i18n('toast.remove_complaints'),
        })
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
        throw error
      }
    },
    async removeLinkMeta(postId: number) {
      try {
        await useApi({ ...ePosts.removeLinkMeta }, { postId })
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },
    async updatePost(payload: { postId: number; data: any }, files?: File[]) {
      const form = new FormData()
      const jsonPayload = new Blob([JSON.stringify(payload.data)], { type: 'application/json' })
      form.append('data', jsonPayload)
      if (files) {
        files.forEach((file, idx) => {
          form.append('files', file, `file_${idx}.upload`)
        })
      }
      try {
        const { data } = await useApi({
          url: `${ePosts.getPosts.url}/${payload.postId}`,
          method: 'put',
          body: form,
        })
        const idx = this.posts.findIndex((e) => e.id === data.id)
        if (idx > -1) {
          this.posts[idx] = data
        }

        useMainStore().toast({ type: 'success', message: i18n('toast.success'), detail: i18n(`toast.${data.state.toLowerCase()}`) })
        return data
      } catch (e) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: e.response.data.message })
        throw e
      }
    },
    refreshPostList(searchBy?: TPostSearchBy) {
      this.refresh$.next(searchBy)
    },
    async getPostComplaints(postId: number) {
      try {
        const { data } = await useApi({ ...ePosts.getPostComplaints }, { postId })
        return data.content
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },
    async getCommentComplaints(commentUuid: string) {
      try {
        const { data } = await useApi({ ...ePosts.getCommentComplaints }, { commentUuid })
        return data.content
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },
    async getPostComplaintItems(force?: boolean) {
      const id = `complaint-reasons`

      if (!force && Object.keys(this.postComplaintItems).length) {
        return this.postComplaintItems
      }
      if (this.promiseMap[id]) {
        return await this.promiseMap[id]
      }

      this.promiseMap[id] = new Promise((resolve, reject) => {
        this.loading = true
        useApi({
          ...ePosts.getComplaintReasons,
        })
          .then(({ data }) => {
            this.postComplaintItems = { ...data }
            this.promiseMap[id] = undefined
            resolve(data)
          })
          .catch((err) => {
            useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: err.response.data.message })
            this.promiseMap[id] = undefined
            reject(err)
          })
          .finally(() => {
            this.loading = false
          })
      })
      return await this.promiseMap[id]
    },
    async complaintPost(payload: { postId: string; reason: { id: number; name: string }; reasonOther?: string }) {
      const { reason, reasonOther } = payload
      try {
        this.loading = true
        const { data } = await useApi(
          {
            ...ePosts.createComplaints,

            body: { reason, reasonOther },
          },
          { postId: payload.postId }
        )
        useMainStore().toast({ type: 'success', message: i18n('toast.success'), detail: i18n('toast.post_complaint_message') })
        return data
      } catch (err) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: err.response.data.message })
      } finally {
        this.loading = false
      }
    },
    async complaintComment(payload: {
      commentUuid: string
      reason: { id: number; name: string }
      reasonOther?: string
    }) {
      const { reason, reasonOther } = payload
      try {
        this.loading = true
        const { data } = await useApi(
          {
            ...ePosts.createCommentComplaints,

            body: { reason, reasonOther },
          },
          { commentUuid: payload.commentUuid }
        )
        const message = 'Your comment complaint registered has been successfully'
        useMainStore().toast({ type: 'success', message: i18n('toast.success'), detail: message })
        return data
      } catch (err) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: err.response.data.message })
      } finally {
        this.loading = false
      }
    },
    async getPostsNotificationSettings(params = {}) {
      try {
        const { data } = await useApi({ ...ePosts.getPostsNotificationSettings, params })
        return data.content
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },
    async getPostNotificationSettingsById(postId: number) {
      try {
        const { data } = await useApi(ePosts.getPostNotificationSettingsById, { postId })
        if (data) return data.muted
      } catch (error) {
        return false
      }
    },
    async setPostNotificationSettings(id: number, val: boolean) {
      try {
        await useApi({ ...ePosts.setPostsNotificationsSettings, body: { isMuted: val } }, { postId: id.toString() })
        useMainStore().toast({
          type: 'success',
          message: i18n('toast.success'),
          detail: val ? i18n('post.mute_toast') : i18n('group.unmute_toast'),
        })
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },
    async saveToCollection(postId: number, collection: ICollection) {
      try {
        await useApi({ ...ePosts.saveToCollection }, { postId, collectionId: collection.id })
        useMainStore().toast({ type: 'success', message: i18n('toast.success'), detail: i18n('collections.post_saved_to') + ' ' + collection.name })
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },
    async createCollection(payload: any) {
      try {
        const { data } = await useApi({ ...ePosts.createCollection, body: payload })
        return data
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },
    async editCollection(payload) {
      try {
        const { data } = await useApi({ ...ePosts.editCollection, body: payload }, { collectionId: payload.id })
        return data
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },
    async getCollections(params = {}) {
      try {
        const { data } = await useApi({ ...ePosts.getCollections, params })
        this.collections = data
        return data
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },
    async removeCollection(collectionId: number) {
      try {
        await useApi({ ...ePosts.removeCollection }, { collectionId })
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },
    async getCollectionPosts(collectionId: number) {
      try {
        const { data } = await useApi({ ...ePosts.getCollectionPosts }, { collectionId })
        return data.content
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    },
    async getLinkPreview(link: string) {
      const { data } = await useApi({ ...ePosts.linkPreview, params: { link } })
      if (data) return data
    },
    async getPostInCollection(postId: number) {
      const { data } = await useApi({ ...ePosts.getPostInCollection, params: { postId } })
      if (data) return data
    },
    async removePostFromCollection(collectionId: number, postId: number) {
      try {
        await useApi({ ...ePosts.removePostFromCollection }, { collectionId ,postId })
        useMainStore().toast({ type: 'success', message: i18n('toast.success'), detail: i18n('Post has been removed from collection') })
      } catch (error) {
        useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
      }
    }
  },
  getters: {
    postById: (state) => (postID) => {
      return state.posts.find((post) => post.id === Number(postID)) as IPost
    }
  },
})
