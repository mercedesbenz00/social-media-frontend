import _ from 'lodash'
import type { IRequest } from '@/data/main.interface'
import { isParsableString, parseString } from './parsers.utils'

export function omitOptions(options: IRequest) {
  return _(options)
    .omit(['url', 'type'])
    .omitBy((e) => _.isUndefined(e) || _.isNil(e))
    .value()
}

export function parseOptions(options: IRequest | string, opt?: any): IRequest {
  let result: IRequest = { url: '', method: 'get' }
  if (typeof options === 'string') {
    result = { url: options, method: 'get' }
  } else {
    const { url, method, headers, body, params, isFormData, data: d } = options
    let data = body ?? d ?? {}
    let m = method
    let h = headers ?? {}

    if (isFormData) {
      h = { ...h, 'Content-Type': 'multipart/form-data' }

      m = m ?? 'post'
      if (d && d instanceof FormData) {
        data = d
      } else {
        const fData = new FormData()
        _.map(body ?? {}, (value, key) => {
          fData.append(key, value)
        })
        data = fData
      }
    }

    result = {
      ...options,
      url,
      data,
      method: m ?? 'get',
      headers: h,
      params,
    }
  }
  if (isParsableString(result.url)) result.url = parseString(result.url, opt)
  return result
}
