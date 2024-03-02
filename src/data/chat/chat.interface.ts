import type { Room } from 'matrix-js-sdk'

export enum CHAT_SERVE_PAGE_ORDER {
  NA = '',
  FORWARD = 'f',
  BACKWARD = 'b',
}

export interface IRoomMember {
  id: string
  name: string
  membership: string
}

export interface IEvent {
  content: any

  event_id: string
  origin_server_ts?: number | string
  room_id: string
  sender: string
  type: string
  user_id: string
}

export interface IRoom {
  id: string
  handler: Room
  timeline?: IEvent[]
  members: IRoomMember[]
  loading?: boolean
  lastRead: { [userId: string]: string }
  checkReadDebounce?: any
  lastFullyReadTime?: number
  sending?: string[]
}

export interface IUser {
  id: string
  profile: any
  state: any
  avatar: any
  firstName: string
  lastName: string
}

export interface IRecord {
  file: any
  time: number
  name: string
  type: string
}

export interface IFloatingRoom {
  id: string
  state: boolean
}
