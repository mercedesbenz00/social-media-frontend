import type { IEndpoints } from '../main.interface'
export const ePersonMedia: IEndpoints = {
  avatar: {
    url: '/person-service/api/v1/persons/#personId/avatar',
  },
  setAvatar: {
    url: '/person-service/api/v1/persons/#personId/avatar',
    method: 'post',
  },
  cover: {
    url: '/person-service/api/v1/persons/#personId/cover',
  },
  setCover: {
    url: '/person-service/api/v1/persons/#personId/cover',
    method: 'post',
  },
  removeCover: {
    url: '/person-service/api/v1/persons/#personId/cover',
    method: 'delete',
  },
  removeAvatar: {
    url: '/person-service/api/v1/persons/#personId/avatar',
    method: 'delete',
  }
}
