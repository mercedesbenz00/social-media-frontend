import type { IEndpoints } from '../main.interface'
export const ePosts: IEndpoints = {
  getPosts: {
    url: '/post-service/api/v1/posts',
    method: 'get',
  },
  getComment: {
    url: '/post-service/api/v2/comments/#commentId',
    method: 'get',
  },
  getComments: {
    url: '/post-service/api/v1/comments',
    method: 'get',
  },
  postComment: {
    url: '/post-service/api/v2/comments',
    method: 'post',
    isFormData: true,
  },
  postReply: {
    url: '/post-service/api/v2/comments/#commentId/reply',
    method: 'post',
    isFormData: true,
  },
  removePost: {
    url: '/post-service/api/v1/posts',
    method: 'delete',
  },
  removeComment: {
    url: '/post-service/api/v1/comments/#commentId',
    method: 'delete',
  },
  createPost: {
    url: '/post-service/api/v1/posts',
    method: 'post',
    isFormData: true,
  },
  getComplaintReasons: {
    url: '/post-service/api/v1/posts/complaints/reasons',
    method: 'get',
  },
  createComplaints: {
    url: '/post-service/api/v1/posts/#postId/complaints',
    method: 'post',
  },
  createCommentComplaints: {
    url: '/post-service/api/v1/comments/#commentUuid/complaints',
    method: 'post',
  },
  editComment: {
    url: '/post-service/api/v2/comments/#commentId',
    method: 'put',
    isFormData: true,
  },
  getPostsNotificationSettings: {
    url: '/post-service/api/v1/posts/notification-settings',
    method: 'get',
  },
  getPostNotificationSettingsById: {
    url: '/post-service/api/v1/posts/notification-settings/#postId',
    method: 'get',
  },
  setPostsNotificationsSettings: {
    url: '/post-service/api/v1/posts/notification-settings/#postId',
    method: 'put',
  },
  deleteCommentMedia: {
    url: '/post-service/api/v2/comments/{commentUuid}/deleteMedia',
    method: 'delete',
  },
  vote: {
    url: '/post-service/api/v1/comments/#commentId/votes/#voteType',
    method: 'put',
  },
  deleteVote: {
    url: '/post-service/api/v1/comments/#commentId/votes',
    method: 'delete',
  },
  getPostsWithComplaints: {
    url: '/post-service/api/v1/posts/search/with-complaints',
    method: 'get',
  },
  getCommentsWithComplaints: {
    url: '/post-service/api/v2/comments/search/with-complaints',
    method: 'get',
  },
  getPostComplaints: {
    url: '/post-service/api/v1/posts/#postId/complaints',
    method: 'get',
  },
  getCommentComplaints: {
    url: '/post-service/api/v1/comments/#commentUuid/complaints',
    method: 'get',
  },
  removePostComplaints: {
    url: '/post-service/api/v1/posts/#postId/reject-complaints',
    method: 'patch',
  },
  removeCommentComplaints: {
    url: '/post-service/api/v1/comments/#commentUuid/reject-complaints',
    method: 'patch',
  },
  createCollection: {
    url:'/post-service/api/v1/post-collections/',
    method: 'post'
  },
  getCollections: {
    url:'/post-service/api/v1/post-collections/',
    method: 'get'
  },
  saveToCollection: {
    url:'post-service/api/v1/post-collections/#collectionId/posts/#postId',
    method: 'put'
  },
  removeCollection: {
    url:'/post-service/api/v1/post-collections/#collectionId',
    method: 'delete'
  },
  getCollectionPosts: {
    url:'/post-service/api/v1/post-collections/#collectionId/posts',
    method: 'get'
  },
  editCollection: {
    url:'/post-service/api/v1/post-collections/#collectionId',
    method: 'put'
  },
  linkPreview: {
    url: '/post-service/api/v1/link-preview',
    method: 'get',
  },
  removeLinkMeta: {
    url: '/post-service/api/v1/posts/linkMeta/#postId',
    method: 'delete',
  },
  getPostInCollection: {
    url: '/post-service/api/v1/post-collections/my-collection-by-post-id',
    method: 'get'
  },
  removePostFromCollection: {
    url: '/post-service/api/v1/post-collections/#collectionId/posts/#postId',
    method: 'delete'
  }
}
