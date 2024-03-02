import { usePersonsStore } from './../persons/persons.store'
import { ACCESS_TOKEN } from '@/constants/global.constants'
import { defineStore } from 'pinia'

import type { MatrixClient, Room, MatrixEvent, RoomMember } from 'matrix-js-sdk'
import { ReceiptType } from 'matrix-js-sdk/lib/@types/read_receipts'
// import * as Matrix from 'matrix-js-sdk'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useAuthStore } from '../auth/auth.store'
import { forEach, get, map, set, omit, orderBy } from 'lodash'
import type { IRecord, IRoom, IUser, IFloatingRoom } from './chat.interface'
import { i18n } from '@/plugins/0/i18n.plugin'
import '/lib/out/matrix'
import { useMainStore } from '../main.store'

const chatUrl = import.meta.env.APP_CHAT_URL
const LOG_EVENTS = false

export const useChatStore = defineStore('chat', {
  state: () => ({
    myId: undefined as string | number | undefined,
    selectedRoom: useCookies().get('room') as string | null,
    client: null as MatrixClient | null,
    roomOrder: [] as string[],
    rooms: {} as { [name: string]: IRoom },
    users: {} as { [name: string]: IUser },
    retryCount: 0 as number,
    // history
    token: '',
    floating: {
      state: false,
      openRooms: [] as IFloatingRoom[],
    },
    clientInit: false,
    initRoomLoading: false,
    orderDebounce: undefined as any,
    receiptDebounce: undefined as any,
    audioArray: [] as any,
  }),
  getters: {
    unreadCount() {
      if (this.rooms) {
        let t = 0
        forEach(this.rooms, (v) => {
          t += v.handler.getUnreadNotificationCount() ?? 0
        })
        return t > 9 ? '9+' : t
      } else return undefined
    },
  },

  actions: {
    initClient() {
      if (this.clientInit) return
      this.clientInit = true

      const matrix = window.matrixcs
      if (!this.client) {
        this.client = matrix.createClient({ baseUrl: chatUrl, timelineSupport: true, debug: false })
      }
      this.login()
    },
    async login() {
      if (!this.client) return
      const token = useCookies().get(ACCESS_TOKEN)
      const { user } = useAuthStore()
      if (user?.id) {
        const credential = {
          id: `@user.${user.id}:matrix`,
          password: token,
        }
        this.myId = credential.id
        this.setUserProfile({ userId: this.myId })

        try {
          const res = await this.client?.loginWithPassword(credential.id, credential.password)
          this.token = res.access_token

          this.startClient()
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Error while login to chat server', err)
        }
      }
    },
    startClient() {
      if (!this.client) return
      this.client.startClient({
        initialSyncLimit: 40,
        includeArchivedRooms: true,
        resolveInvitesToProfiles: true,
        experimentalThreadSupport: true,
      })
      this.client.once('sync' as any, () => {
        this.getHistory()
        this.startEventListeners()
      })
    },
    startEventListeners() {
      if (!this.client) return
      this.client.on('event' as any, (event: MatrixEvent) => {
        if (event.event.type === 'm.presence') return this.handlePrecence(event)
        if (event.event.type === 'm.typing') return this.handleTyping(event)
        // eslint-disable-next-line no-console
        if (LOG_EVENTS) console.log('event', event.event.type, event)

        if (event.event.type === 'm.receipt') return this.handleReceipt(event)
        if (event.event.type?.startsWith('m.room.')) {
          // room events
          if (event.event.type === 'm.room.join_rules') return this.handleNewMessage(event)
          if (event.event.type === 'm.room.member' && event.event.content?.membership === 'join')
            return this.refreshRoom(event.event.room_id)
          if (event.event.type === 'm.room.member' && event.event.content?.membership === 'leave')
            return this.leaveRoom(event.event.room_id)
          if (event.event.type === 'm.room.message') return this.handleNewMessage(event)
        }
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleNewMessage(event: MatrixEvent) {
      // TODO: notification for messages
      this.orderRooms()
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleReceipt(event) {
      this.checkReadStatusForRooms()
    },
    isBlockedUser(userId: string) {
      return this.client?.isUserIgnored(userId)
    },
    getHistory() {
      if (!this.client) return
      const rooms = this.client.getRooms()
      rooms.forEach((room) => {
        this.initilizeRoom(room)
      })
      this.orderRooms()
      this.checkReadStatusForRooms()
      this.selectRoom()
    },
    selectRoom(id?: string): void {
      if (id) {
        this.selectedRoom = id
        useCookies().set('room', id)
      }
    },
    canGetPresence(members): boolean {
      return !(members.filter((e) => e.membership !== 'join').length > 0)
    },
    calculateRoomStatus(members: RoomMember[]): 'active' | 'pending' | 'invited' | 'blocked' {
      for (let i = 0; i < members.length; i++) {
        const member = members[i]
        if (member.membership !== 'join' && member.userId === this.myId) return 'invited'
        if (member.membership !== 'join' && member.userId !== this.myId) return 'pending'
      }
      return 'active'
    },

    async initilizeRoom(room: Room) {
      let members: RoomMember[] = room.getMembers()

      const roomId = `${room.roomId}`
      if (members.length < 2) {
        const memberResponse = (await this.client?.members(roomId)) as any
        members = memberResponse.chunk.map((m) => {
          return {
            userId: m.state_key,
            name: m.content.displayName,
            membership: m.content.membership,
          }
        })
      }
      set(
        this.rooms,
        [roomId, 'members'],
        members.map((e) => ({ id: e.userId, name: e.name, membership: e.membership }))
      )

      set(this.rooms, [roomId, 'id'], roomId)
      set(this.rooms, [roomId, 'handler'], room)
      set(this.rooms, [roomId, 'status'], this.calculateRoomStatus(members))
      // Popolate users

      members.forEach((member) => {
        set(this.rooms, [roomId, 'lastRead', member.userId], room.getEventReadUpTo(member.userId))
        if (member.userId !== this.myId) {
          this.setUserProfile(member)
          if (this.canGetPresence(members)) this.fetchUserPrecence(member)
        }
      })
    },
    async tryReceipt(event) {
      if (this.client) {
        await this.client.sendReadReceipt(event)
      }
    },
    async fetchUserPrecence(member) {
      if (this.client) {
        let state: any = {}
        if (member.user) {
          state['currently_active'] = member.user.currentlyActive
          state['last_active_ago'] = member.user.lastActiveAgo
          state['presence'] = member.user.presence
        } else {
          try {
            state = await this.client.getPresence(member.userId)
          } catch (error) {
            state['presence'] = 'unknown'
          }
        }
        set(this.users, [member.userId, 'state'], state)
      }
    },
    async setUserProfile(member) {
      const profileFields = ['name', 'rawDisplayName', 'displayName', 'gender', 'avatar']
      const target = 'profile'

      if (member) {
        const memberId = member.userId.split('.')[1].split(':')[0]

        const userDetails = await usePersonsStore().getPersonById(memberId)
        member = { ...member, ...userDetails }
        set(this.users, [member.userId, 'id'], member.userId)

        profileFields.forEach((element) => {
          set(this.users, [member.userId, target, element], get(member, [element]))
        })
      }
    },
    refreshRoom(roomId) {
      if (!this.client) return
      const room = this.client.getRoom(roomId)
      if (room) this.initilizeRoom(room)
    },

    handleTyping(event) {
      const typingUsers = get(event, 'event.content.user_ids')

      forEach(this.users, (user, key) => {
        set(user, 'state.typing', typingUsers.includes(key))
      })
    },
    handlePrecence(event) {
      const userId = event.event.sender
      set(this.users, [userId, 'state'], { ...get(this.users, [userId, 'state'], {}), ...event.event.content })
    },

    async sendMessage(roomId: string, value: string, media?: any) {
      try {
        if (!this.client) return
        let messageId
        if (!media) {
          messageId = await this.client.sendEvent(roomId, 'm.room.message', {
            msgtype: 'm.text',
            body: value ?? '',
          })
        } else {
          const { info } = media
          const message = omit(
            {
              ...media,
              body: value ?? media.info?.fileName,
              info
            },
            'reversedUrl',
            'file'
          )
          messageId = await this.client.sendEvent(roomId, 'm.room.message', message)
        }

        const room = this.rooms[roomId]
        room.sending = [...(room.sending ?? []), messageId.event_id]
      } catch (error) {
        if (!navigator?.onLine) {
          useMainStore().toast({
            type: 'error',
            additionalType: 'message',
            message: i18n('toast.message_title_error'),
            detail: i18n('toast.message_desc_error'),
            life: 10000,
            retryFunc: () => {
              this.sendMessage(roomId, value, media)
            }
          })
        } else {
          useMainStore().toast({ type: 'error', message: i18n('toast.error'), detail: error.response.data.message })
        }
      }
    },

    async sendReceiptEvent(event: MatrixEvent) {
      if (this.client) {
        this.client.sendReadReceipt(event, ReceiptType.Read)
      }
    },
    async sendTyping(roomId: string, status: boolean) {
      if (!this.client) return
      await this.client.sendTyping(roomId, status, 4000)
    },

    setChunkEnd(roomId: string, end: string) {
      set(this.rooms, [roomId, 'end'], end)
    },
    orderRooms() {
      if (this.orderDebounce) clearTimeout(this.orderDebounce)
      this.orderDebounce = setTimeout(() => {
        const temp = map(this.rooms, (v, k) => {
          const t = v.handler.getLastActiveTimestamp()

          return {
            id: k,
            time: t ?? 0,
          }
        })
        let newRooms = [] as any
        const oldRooms = [] as any
        temp.forEach((e) => {
          if (e.time < 0) newRooms.push(e)
          else oldRooms.push(e)
        })
        newRooms = newRooms.map((e: any) => e.id)
        this.roomOrder = orderBy(oldRooms, 'time', 'desc').map((e) => e.id)
        newRooms.forEach((e: any) => {
          this.roomOrder.unshift(e)
        })
      }, 200)
    },
    checkReadStatusForRooms() {
      if (this.receiptDebounce) clearTimeout(this.receiptDebounce)
      this.receiptDebounce = setTimeout(() => {
        forEach(this.rooms, (v) => {
          const lastRead = {}
          let lastFullyReadTime
          forEach(v.members, (m) => {
            const event = v.handler.getReadReceiptForUserId(m.id)
            const time: any = get(event, 'data.ts')
            if ((!lastFullyReadTime || time < lastFullyReadTime) && time) lastFullyReadTime = time
            lastRead[m.id] = event?.eventId
          })
          v.lastRead = lastRead
          v.lastFullyReadTime = lastFullyReadTime
        })
      }, 50)
    },

    getChatUserIdFromPersonId(personId: number): string {
      return `@user.${personId.toString().replace(/-/g, '_')}:matrix`
    },

    getRoomAliasForPeople(firstPersonId: number, secondPersonId: number): string {
      return `user.${firstPersonId.toString().replace(/-/g, '_')}-user.${secondPersonId.toString().replace(/-/g, '_')}`
    },

    async createRoomWithPersonId(targetUserId: number, roomId: string, messageData: any) {
      if (this.client) {
        // const { user } = useAuthStore()
        const inviteUserId = this.getChatUserIdFromPersonId(targetUserId)
        // const roomAlias = this.getRoomAliasForPeople(Number(user?.id), targetUserId)

        const createRoomOpts = {
          // room_alias_name: roomAlias,
          visibility: 'private',
          invite: [inviteUserId],
          name: 'Earthlink SN : Private Chat',
          topic: 'Earthlink SN : User Chat',
        }

        return await this.client.createRoom(createRoomOpts as any, (err, data) => {
          if (data) {
            if (messageData) {
              /*let _tCountRooms = _that.countJoinedRooms.getValue();
              _tCountRooms++;
              _that.countJoinedRooms.next(_tCountRooms);
              _that.newRoomCreated$.next({roomId: tData.room_id, personId:pPersonId, removeRoomId: pTmpRoomId});
              */
              setTimeout(() => {
                const now = new Date().getTime()
                const tempEvent = `TMSG-0000-${this.myId}-${data.room_id.substr(0, 4)}-${now}`
                if (messageData.isTxtMsg === true) {
                  const tempData = {
                    msgtype: 'm.text',
                    body: messageData.txtMsg,
                  }

                  if (this.client) {
                    this.client.sendMessage(data.room_id, tempData, tempEvent)
                  }
                }
              }, 10)
            }
          }
        })
      }
    },
    handleEventVisible(event) {
      this.sendReceiptEvent(event)
    },
    async leaveRoom(roomId) {
      if (this.client) {
        await this.joinRoom(roomId)
        await this.client.leave(roomId)
        await this.client.forget(roomId)
        this.roomOrder = this.roomOrder.filter((room) => room !== roomId)
        delete this.rooms[roomId]
      }
    },
    async joinRoom(roomId) {
      if (this.client) {
        const room = this.rooms[roomId]

        const myMembership = room.members.find((e) => e.id === this.myId)
        if (myMembership?.membership === 'invite') {
          const res = await this.client.joinRoom(roomId)
          this.initilizeRoom(res)
        }
      }
    },
    async uploadContent(payload: File) {
      if (!this.client) return undefined
      const opt = {
        name: payload.name,
        type: payload.type,
        onlyContentUri: true,
      }
      return await this.client.uploadContent(payload as any, opt)
    },
    async uploadRecord(payload: IRecord) {
      if (!this.client) return undefined
      const opt = {
        name: payload.name,
        type: payload.type,
        onlyContentUri: true,
      }
      return await this.client.uploadContent(payload.file as any, opt)
    },
    toggleChat(v?: boolean) {
      this.floating = { ...this.floating, state: v ?? !this.floating.state }
    },
    openRoom(id: string) {
      const rooms = this.floating.openRooms.filter((e) => e.id !== id)
      if (rooms.length > 2) rooms.shift()
      this.floating = { ...this.floating, openRooms: [...rooms, { id: id, state: true }] }
    },
    toggleFloatingChat(id: string, v: boolean) {
      const rooms = this.floating.openRooms.filter((e) => e.id !== id)
      if (v) this.floating = { ...this.floating, openRooms: [...rooms, { id: id, state: v }] }
      else this.floating = { ...this.floating, openRooms: [{ id: id, state: v }, ...rooms] }
    },
    removeFloatingChat(id: string) {
      const rooms = this.floating.openRooms.filter((e) => e.id !== id)
      this.floating = { ...this.floating, openRooms: rooms }
    },
    getChatRoomId(targetPersonId) {
      if (!Object.keys(this.rooms).length) return null
      const chatUserId = this.getChatUserIdFromPersonId(targetPersonId)
      for (const [key, value] of Object.entries(this.rooms)) {
        const result = value.members.filter((m) => m.id === chatUserId)
        if (result.length) {
          return key
          break
        }
      }
      return null
    },
    async initRoom(targetPersonId, isFloatingView = true) {
      if (this.initRoomLoading) return

      this.initRoomLoading = true
      const roomId = this.getChatRoomId(targetPersonId)

      if (roomId) {
        isFloatingView ? this.openRoom(roomId) : this.selectRoom(roomId)
      } else {
        const newRoom = await this.createRoomWithPersonId(targetPersonId, '', null)
        if (newRoom?.room_id && this.client) {
          const room = this.client.getRoom(newRoom?.room_id)
          if (room) {
            await this.initilizeRoom(room)

            if (isFloatingView) {
              this.openRoom(newRoom?.room_id)
            } else {
              this.roomOrder.unshift(newRoom?.room_id)
              this.selectRoom(newRoom?.room_id)
            }
          }
        }
      }
      this.initRoomLoading = false
      return roomId
    },
    async moreAndMore(roomId) {
      const room = this.rooms[roomId]?.handler
      if (this.client && room) {
        await this.client.scrollback(room)
      }
    },
    resetState() {
      this.client = null
      this.clientInit = false
      this.roomOrder = [] as string[]
      this.rooms = {} as { [name: string]: IRoom }
      this.users = {} as { [name: string]: IUser }
      this.floating = {
        state: false,
        openRooms: [] as IFloatingRoom[],
      }
    },
    async addToBlockList(userId) {
      return new Promise((resolve) => {
        try {
          const blockedUserIds = this.client?.getIgnoredUsers() || []
          const newBlockedUserIds = [...blockedUserIds, userId]
          this.client?.setIgnoredUsers(newBlockedUserIds, () => {
            return resolve({ success: true })
          })
        } catch (error) {
          console.error('Error adding user to the block list:', error)
          return resolve({ success: false })
        }
      })
    },
    async removeFromBlockList(userId) {
      return new Promise((resolve) => {
        try {
          const blockedUserIds = this.client?.getIgnoredUsers() || []
          if (blockedUserIds.includes(userId)) {
            const newBlockedUserIds = blockedUserIds.filter((item) => item !== userId)
            this.client?.setIgnoredUsers(newBlockedUserIds, () => {
              return resolve({ success: true })
            })
          }
        } catch (error) {
          console.error('Error adding user to the block list:', error)
          return resolve({ success: false })
        }
      })
    },
  },
})

declare global {
  interface Window {
    matrixcs: any
  }
}
