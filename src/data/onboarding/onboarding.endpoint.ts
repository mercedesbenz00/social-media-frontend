import type { IEndpoints } from '../main.interface'
export const eOnboarding: IEndpoints = {
  categories: {
    url: '/group-service/api/v1/categories',
    method: 'get'
  },
  assignCategories: {
    url: '/group-service/api/v1/categories/persons',
    method: 'put'
  }
}
