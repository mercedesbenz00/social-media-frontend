import type { IEndpoints } from '../main.interface'

export const eStore: IEndpoints = {
  products: {
    method: 'get',
    url: '/store',
  },
}
