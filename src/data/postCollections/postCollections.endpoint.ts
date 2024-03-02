import type { IEndpoints } from '../main.interface'
export const ePostCollection: IEndpoints = {
  post_collections: {
    url: '/post-service/api/v1/post-collections',
    method: 'get'
  },
}
