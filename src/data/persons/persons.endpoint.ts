import type { IEndpoints } from '../main.interface'
export const ePersons: IEndpoints = {
  persons: {
    url: '/person-service/api/v1/persons',
  },
  checkUserName: {
    url: '/person-service/api/v1/persons/check-username',
    method: 'get',
  },
  changePassword: {
    url: '/person-service/api/v1/persons/change-password',
    method: 'post',
  },
  deleteAccount: {
    url: '/person-service/api/v1/persons',
    method: 'delete',
  },
  getPerson: {
    url: '/person-service/api/v1/persons/',
    method: 'get',
  },
  getPersonById: {
    url: '/person-service/api/v1/persons/by-id/#personId',
    method: 'get',
  },
  updateProfile: {
    url: '/person-service/api/v1/persons/#personId',
    method: 'put',
  },
  followers: {
    url: '/person-service/api/v1/persons/#personId/followers',
    method: 'get',
  },
  updatePerson: {
    url: '/person-service/api/v1/persons/#personId',
    method: 'put',
  },
  following: {
    url: '/person-service/api/v1/persons/#personId/following',
    method: 'get',
  },
  follow: {
    url: '/person-service/api/v1/persons/#personId/follow',
    method: 'post',
  },
  unfollow: {
    url: '/person-service/api/v1/persons/#personId/follow',
    method: 'delete',
  },
  inviteFriend: {
    url: '/person-service/api/v1/persons/invite-friend',
    method: 'post',
  },
  createGroupBans: {
    url: '/person-service/api/v1/persons/bans/groupBans',
    method: 'post',
  },
  getGroupBans: {
    url: '/person-service/api/v1/persons/bans/groupBans',
    method: 'get',
  },
  checkBan: {
    url: '/person-service/api/v1/persons/bans/groupBans/exist',
    method: 'get',
  },
  deleteGroupBan: {
    url: '/person-service/api/v1/persons/bans/groupBans/#groupBanId',
    method: 'delete',
  },
  createComplaints: {
    url: '/person-service/api/v1/persons/complaints',
    method: 'post',
  },
  mutePeople: {
    url: '/person-service/api/v1/persons/complaints',
    method: 'post',
  },
  getFollowersNotificationsSettings: {
    url: '/person-service/api/v1/persons/notification-settings',
    method: 'get',
  },
  getFollowingNotificationSettingsById: {
    url: '/person-service/api/v1/persons/notification-settings/#followingId',
    method: 'get',
  },
  setPersonsNotificationsSettings: {
    url: '/person-service/api/v1/persons/notification-settings/#followingId',
    method: 'put',
  },
  getBlockedPersons: {
    url: '/person-service/api/v1/persons/#userId/blocks',
    method: 'get',
  },
  blockPerson: {
    url: '/person-service/api/v1/persons/#userId/blocks',
    method: 'post',
  },
  unblockPerson: {
    url: '/person-service/api/v1/persons/#userId/blocks',
    method: 'delete',
  },
  getMutedPersons: {
    url: '/person-service/api/v1/persons/#userId/mutes',
    method: 'get',
  },
  mutePerson: {
    url: '/person-service/api/v1/persons/#userId/mutes',
    method: 'post',
  },
  unmutePerson: {
    url: '/person-service/api/v1/persons/#userId/mutes',
    method: 'delete',
  }
}
