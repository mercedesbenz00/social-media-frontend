export interface IRequest {
  url: string
  method?: string
  headers?: { [key: string]: string }
  isFormData?: boolean
  body?: any
  data?: any
  params?: any
}

export interface IPromiseMap<T> {
  [key: string]: Promise<T> | undefined | null
}

export interface IEndpoints {
  [key: string]: IRequest
}

export interface IToast {
  message: string
  type?: 'success' | 'error' | 'info' | 'warn',
  additionalType?: 'wifi' | 'message' | 'member' | 'comment'
  sticky?: boolean
  life?: number
  detail?: string
  closable?: boolean
  group?: string
  class?: string
  contentClass?: string
  retryFunc?: Function
}

export interface IConfirm {
  message: string
  header: string
  icon?: string
  accept: VoidFunction
  reject: VoidFunction
  acceptLabel: string
  rejectLabel: string
}

export interface IPopupMenuItem {
  title: string
  class?: string
  icon?: string
  action: VoidFunction
}

export interface INotificationsSettings {
  post: {
    postId: number
    muted: boolean
  }
  group: {
    groupId: number
    muted: boolean
  }
  person: {
    personId: number
    muted: boolean
  }
}
