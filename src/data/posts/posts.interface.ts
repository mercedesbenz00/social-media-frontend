import type { IMediaFile, IReason } from '@/data/main.model'
import type { IUser } from '../chat/chat.interface'
import type { IPerson } from '../persons/persons.interface'

export type PostType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'LINK' | 'REPOST'
export type PostState = 'DELETED' | 'REJECTED' | 'PUBLISHED' | 'WAITING_TO_BE_PUBLISHED' | 'DRAFT'
export interface IVoteData {
  id: number
  upvotesTotal: number
  downvotesTotal: number
  voteValue: number
}

export interface ICollection {
  id: number
  ownerId: number
  name: string
  createdAt: number,
  posts: any[],
  isPublic: boolean
}
export interface IPostData {
  title?: string
  content?: string
  userGroupId?: number
  type?: PostType
  commentsAllowed?: boolean
  state?: PostState
  shouldPin?: boolean
  isShareShortVideo?: boolean
  repostedFromId?: number | null,
  mentionedPersonIds: number[],
  linkMeta?: any
}

export interface IComplaintItem {
  id: number
  name: string
  localizations: {
    ar?: string
    en?: string
  }
}

export interface IPost extends IPostData {
  author?: IUser
  id: number
  postUuid: string
  authorDisplayName: string
  createdAt: number
  publishedAt: number
  authorId: number
  userGroupId: number
  state: PostState
  stateDisplayName: string
  totalVotes?: IVoteData
  files?: IMediaFile[]
  commentsCount?: number
  comments?: Comment[]
  isFollower?: boolean
  isAdmin?: boolean
  pinned?: boolean
  isModerator?: boolean
  commendsAllowed?: boolean
}

export interface PostComplaintData {
  reason: IReason
  reasonOther: string
}

export type PostComplaintState = 'PENDING' | 'REJECTED' | 'APPROVED'

export interface PostComplaint extends PostComplaintData {
  id: number
  postId: number
  createdAt: number
  authorId: number
  state?: PostComplaintState
  resolverId?: number
  resolvingText?: string
  resolvingDate?: Date
}

export interface CommentData {
  postId: number
  content: string
}

export interface Comment extends CommentData {
  id: number
  createdAt: number
  authorId: number
  replyTo?: number
  edited?: boolean
  totalVotes?: IVoteData
  replyCommentsCount: number
  replies: Comment[]
  author: IPerson
}
export interface IComment {
  id: number
  content: any
  commentId: number
  commentUuid: string
  authorId?: number
  createdAt: number
  modifiedAt?: number
  postId: number
  userGroupId?: number
  replyTo?: string
  totalVotes: IVoteData
  replyCommentsCount: number
  deleted?: boolean
  pinned?: boolean
  file?: any
}

export interface CommentComplaintData {
  reason: IReason
  reasonOther: string
  state?: CommentComplaintState
}

export type CommentComplaintState = 'PENDING' | 'REJECTED' | 'APPROVED'

export interface CommentComplaint extends CommentComplaintData {
  id: number
  commentId: number
  authorId: number
  createdAt: number
  state?: CommentComplaintState
  resolverId?: number
  resolvingText?: string
  resolvingDate?: Date
}

export interface PostSearchCriteria {
  query?: string
  groupIds?: number[]
  authorIds?: number[]
  postType?: string
  sortType?: string | 'TRENDING' | 'TOP' | 'POPULAR' | 'NEWEST'
  sort?: 'createdAt' | 'publishedAt' | string
  likedByPersons?: number[]
  postIds?: number[]
  states?: string[]
  pinned?: boolean
  subscribed?: boolean
}

export const PostStates = {
  PUBLISHED: 'PUBLISHED' as PostState,
  DELETED: 'DELETED' as PostState,
  REJECTED: 'REJECTED' as PostState,
  WAITING_TO_BE_PUBLISHED: 'WAITING_TO_BE_PUBLISHED' as PostState,
  DRAFT: 'DRAFT' as PostState,
}
