export interface ITokenResponse {
  token: string
  refreshToken: string
  expireTime: number
}

/**
  * @interface IAuthUser
  admin: false
  authorities: []
  avatar: {id: 1003, fileType: "AVATAR",…}
  birthDate: "1990-11-23"
  cityId: 27
  cover: null
  deletedDate: null
  displayName: "ozan"
  email: "m.ozancakir@gmail.com"
  firstName: "Mustafa"
  followerCount: 1
  followingCount: 1
  gender: "MALE"
  groupCount: 2
  id: 359
  interestCount: 10
  isVerifiedAccount: null
  lastName: "Cakir"
  postCount: 0
  roles: ["USER"]
  username: "Mustafa.Cakir.678"
 */

export interface IUserAvatar {
  id: number
  fileType: string
  path: string
  mimeType: string
  ownerId: number
  size: number
  createdAt: number
}

export interface IAuthUser {
  id: number
  username: string
  email: string
  firstName?: string
  lastName?: string
  gender?: string
  birthDate?: string
  roles: string[]
  authorities: any[]
  displayName: string
  cityId: number
  deletedDate?: any
  followerCount: number
  followingCount: number
  postCount: number
  groupCount: number
  interestCount: number
  isVerifiedAccount?: boolean
  cover?: any
  avatar?: IUserAvatar
  admin: boolean
}
