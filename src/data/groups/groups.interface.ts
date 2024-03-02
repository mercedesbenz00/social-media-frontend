import type { ICategory } from '@/data/onboarding/onboarding.interface'
import type { IMediaFile } from '@/data/main.model'

export interface IGroupStates {
  APPROVED
  PENDING
  REJECTED
}

export const GroupStates = {
  APPROVED: 'APPROVED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
} as IGroupStates

export interface IGroupData {
  name: string
  description: string
  rules?: string
  postTypeAllowed?: string[]
  avatarPlaceholder?: boolean
  avatarLoaded?: boolean
  avatarUrl?: string
  coverPlaceholder?: boolean
  coverLoaded?: boolean
  coverUrl?: string
  categories?: ICategory[]
  ownerId?: number
  memberState: 'INVITED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_MEMBER'
  stats?: {
    id: number
    membersCount: number
    publishedPostsCount: number
    score: number
  }
  accessType: 'PRIVATE' | 'PUBLIC'
  postingPermission?: 'ALL' | 'WITH_APPROVAL' | 'ADMIN_ONLY',
  avatar?: IMediaFile
  cover?: IMediaFile
  tags: any
  invitePermission: 'ADMIN' | 'MEMBER'
}

export interface IJsonGroupData {
  name: string
  description: string
  accessType?: string
  rules?: string
  postingPermission?: string
  postTypeAllowed?: string[]
  categories?: number[]
  tags?: number[]
  state?: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export interface IGroup extends IGroupData {
  id: number
  createdAt: Date
  permissions: string[]
}
export interface IGroupMember {
  group: IGroup
  memberSince: number
  memberState: IGroupMemberState
  publishedPostsCount: number
  visitedAt: number
}

export type IGroupMemberStatus = 'ADMIN' | 'MODERATOR' | 'USER'
export type IGroupMemberState = 'APPROVED' | 'REJECTED' | 'PENDING'
export interface GroupMember {
  id: number
  personId: number
  groupId: number
  createdAt: Date
  state: IGroupMemberState
  statuses: IGroupMemberStatus[]
  displayName: string
}

export interface GroupPermissionData {
  personId: number
  permission: 'ADMIN' | 'MODERATOR'
}

export interface GroupPermission extends GroupPermissionData {
  id: number
  userGroup: IGroup
}

export interface GroupCollectionData {
  groupId: number
  name: string
  defaultCollection?: boolean
}

export interface GroupCollection extends GroupCollectionData {
  id: number
  createdAt: number
}

export type IGroupAccessType = 'PRIVATE' | 'PUBLIC'

export type IGroupPostingPermissionTypes = 'ADMIN_ONLY' | 'WITH_APPROVAL' | 'ALL'
export const GroupPostingPermissions = {
  ADMIN_ONLY: 'ADMIN_ONLY',
  WITH_APPROVAL: 'WITH_APPROVAL',
  ALL: 'ALL',
} as Record<IGroupPostingPermissionTypes, any>

export type IGroupPostingAllowedType = 'TEXT' | 'LINK' | 'VIDEO' | 'IMAGE'
export const GroupPostingAllowedTypes = {
  TEXT: 'TEXT',
  LINK: 'LINK',
  VIDEO: 'VIDEO',
  IMAGE: 'IMAGE',
} as Record<IGroupPostingAllowedType, any>
