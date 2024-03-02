import type { IUser } from '@/data/auth/auth.interface'
import type { ComputedRef, Ref } from 'vue'

export interface IPerson extends IUser {
  blockedPerson?: IPerson
  bio?: string
}
export interface IFollowingResponse {
  content: object[]
  pageable: {
    sort: object
    offset: number
    pageSize: number
    pageNumber: number
    paged: boolean
    unpaged: boolean
  }
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  sort: object
  numberOfElements: number
  first: boolean
  empty: number
}
export interface IFollowersResponse {
  content: object[]
  pageable: {
    sort: object
    offset: number
    pageSize: number
    pageNumber: number
    paged: boolean
    unpaged: boolean
  }
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  sort: object
  numberOfElements: number
  first: boolean
  empty: number
}

export interface IBlockedPerson {
  createdAt: number
  id: number
  blockedPerson: IPerson
  person: IPerson
}

export interface IMutedPerson {
  createdAt: number
  id: number
  mutedPerson: IPerson
  person: IPerson
}