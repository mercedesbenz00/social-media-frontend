import type { IEndpoints } from '../main.interface'
export const eNotifications: IEndpoints = {
  getNotifications: {
    url: '/notification-service/api/v1/notifications',
    method: 'get'
  },
  updateNotifications: {
    url: '/notification-service/api/v1/notifications',
    method: 'put'
  },
  updateToken: {
    url: '/notification-service/api/v1/tokens/person-device-tokens',
    method: 'put'
  },
  removeToken: {
    url: 'notification-service/api/v1/tokens/person-device-tokens',
    method: 'delete'
  }
}
