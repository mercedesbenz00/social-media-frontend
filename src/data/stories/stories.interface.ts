export interface IStory {
  accessType: string,
  authorId: number,
  createdAt: number,
  file: {
    createdAt: number,
    fileType: string,
    id: number,
    mimeType: number,
    ownerId: number,
    path: string,
    size: number,
    storyId?: number,
  },
  id: number,
  selectedFollowerIds: number[]
}