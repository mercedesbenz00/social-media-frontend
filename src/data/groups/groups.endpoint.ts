import type { IEndpoints } from '../main.interface'
export const eGroups: IEndpoints = {
  groups: {
    url: '/group-service/api/v1/groups',
    method: 'get',
  },
  myGroups: {
    url: '/group-service/api/v1/groups/my-groups',
    method: 'get',
  },
  updateGroup: {
    url: '/group-service/api/v1/groups/#groupId',
    method: 'put',
  },
  suggestedGroups: {
    url: '/group-service/api/v1/groups/suggested',
    method: 'get',
  },
  popularGroups: {
    url: '/group-service/api/v1/groups/popular',
    method: 'get',
  },
  similarGroups: {
    url: '/group-service/api/v1/groups/similar',
    method: 'get',
  },
  frequentGroups: {
    url: '/group-service/api/v1/groups/frequently-posts',
    method: 'get',
  },
  topGroups: {
    url: '/group-service/api/v1/groups/top',
    method: 'get',
  },
  removeUserFromGroup: {
    url: '/group-service/api/v1/groups/#groupId/members',
    method: 'delete',
  },
  joinGroup: {
    url: '/group-service/api/v1/groups/#groupId/members',
    method: 'post',
  },
  isMember: {
    url: '/group-service/api/v1/groups/#groupId/members/#memberId',
    method: 'get',
  },
  group: {
    url: '/group-service/api/v1/groups/#groupId',
    method: 'get',
  },
  members: {
    url: '/group-service/api/v1/groups/#groupId/members',
    method: 'get',
  },
  removePermission: {
    url: '/group-service/api/v1/groups/#groupId/permissions/#permissionId',
    method: 'delete'
  },
  addPermission: {
    url: '/group-service/api/v1/groups/#groupId/permissions',
    method: 'post'
  },
  permissions: {
    url: '/group-service/api/v1/groups/permissions',
    method: 'get',
  },
  categories: {
    url: '/group-service/api/v1/categories/search',
    method: 'get',
  },
  category: {
    url: '/group-service/api/v1/categories/#categoryId',
    method: 'get',
  },
  avatar: {
    url: '/group-service/api/v1/groups/#groupId/avatar',
    method: 'post',
  },
  cover: {
    url: '/group-service/api/v1/groups/#groupId/cover',
    method: 'post',
  },
  mutualFriends: {
    url: '/group-service/api/v1/groups/#groupId/mutual-friends',
    method: 'get',
  },
  updateMemberState: {
    url: '/group-service/api/v1/groups/#groupId/members/#memberId',
    method: 'put',
  },
  memberState: {
    url: '/group-service/api/v1/groups/#groupId/members/#memberId',
    method: 'get',
  },
  invite: {
    url: '/group-service/api/v1/groups/#groupId/invite/#memberId',
    method: 'get',
  },
  getGroupsNotificationSettings: {
    url: '/group-service/api/v1/groups/notification-settings',
    method: 'get',
  },
  getGroupNotificationSettingsById: {
    url: '/group-service/api/v1/groups/notification-settings/#groupId',
    method: 'get',
  },
  setGroupNotificationsSettings: {
    url: '/group-service/api/v1/groups/notification-settings/#groupId',
    method: 'put',
  }
}
