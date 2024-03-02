import type { IEndpoints } from '../main.interface'
export const eAuth: IEndpoints = {
  token: {
    url: '/person-service/api/v1/persons/login',
    method: 'post',
  },
  refresh: {
    url: '/person-service/api/v1/persons/token/refresh',
  },
  me: {
    url: '/person-service/api/v1/persons/profile',
    method: 'get',
  },
  forgotPassword: {
    url: '/person-service/api/v1/persons/forgot-password',
    method: 'post',
  },
  resetPassword: {
    url: '/person-service/api/v1/persons/reset-password',
    method: 'post',
  },
  signup: {
    url: '/person-service/api/v1/persons/register',
    method: 'post',
  },
  getPersonInfo: {
    url: '/person-service/api/v1/persons/by-id',
    method: 'get'
  },
  updatePerson: {
    url: '/person-service/api/v1/persons',
    method: 'put'
  },
  confirmEmail: {
    url: '/person-service/api/v1/persons/email/confirm',
    method: 'get'
  },
  resend: {
    url: '/person-service/api/v1/persons/email/resend',
    method: 'post'
  }
}
