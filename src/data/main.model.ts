import type { IPerson } from '@/data/persons/persons.interface'

export enum PAGE_SORT_ORDER {
  NA = '',
  ASC = 'asc',
  DESC = 'desc',
}

export interface IParams extends Partial<IPagination> {
  [params: string]: any
}

export interface IPagination {
  page: number
  size: number
  sortBy?: string
  sortOrder?: PAGE_SORT_ORDER
}

export interface IPage<T> {
  totalElements: number
  numberOfElements?: number
  totalPages: number
  content: T[]
  pageable?: any
  last: boolean
  empty: boolean
}

export interface IReason {
  id: number
  name: string
}

export interface PostComplaintReason extends IReason {
  localizations?: {
    ar: string
    en: string
  }
}

export interface IMediaFile {
  id: number
  path: string
  fileType: string
  mimeType: string
  owner: IPerson
  size: number
}

export const COMPLAINT_TYPE = {
  POST: 'post',
  COMMENT: 'comment',
  PERSON: 'person',
}

export interface INotificationMeta {
  title: string
  subtitle?: string
  type?: 'pending' | 'success' | 'warn'
  action?: {
    label: string
    to: string
  }
}
