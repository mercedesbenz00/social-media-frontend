import type { IUserAvatar } from "../personMedia/personMedia.interface"

export interface INotification {
  body: string
  createdDate: number
  id: string
  receiverId: number
  state: 'NEW' | 'READ' | 'DELETED' | 'COMPLETED'
  topic: string
  metadata: {
    routeTo: 'POST' | 'POST_COMMENT' | 'STORY' | 'GROUP' | 'PERSON'
    groupId?: number
    authorId?: number
    postId?: number
    commentUuid?: string
    authorName?: string
    groupName?: string
    postUuid?: string
    commentText?: string
    postText?: string
    replyUuid: string
  },
  eventAuthor: {
    id: number
    firstName: string
    lastName: string
    displayName: string
    email: string
    avatar: IUserAvatar
  }
}