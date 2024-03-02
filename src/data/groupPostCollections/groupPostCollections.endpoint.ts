import type { IEndpoints } from '../main.interface'
export const eGroupPostCollections: IEndpoints = {
  createGroupPostCollections: {
    url: '/post-service/api/v1/group-post-collections',
    method: 'post',
  },
  getGroupPostCollections: {
    url: '/post-service/api/v1/group-post-collections',
    method: 'get',
  },
  addPostToGroupCollection: {
    url: '/post-service/api/v1/group-post-collections/#groupCollectionId/posts/#postId',
    method: 'put',
  },
}
