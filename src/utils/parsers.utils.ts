/* eslint-disable no-useless-escape */
import { get, isArray, isEmpty, isObject, isUndefined, map } from 'lodash'

const hashtag = /#+([^/\?&\s,\|\)\(]+)/gmu
const cascadeHashtag = /#+([^#/\?,&\s\|\)\(]+)/gmu

export const isParsableString = (value: string) => {
  const m = value?.matchAll(hashtag)

  const match = [...m]
  return match && !isEmpty(match)
}

export const parseString = (value: string, opt: any) => {
  const m = value?.matchAll(hashtag)
  const match = m ? [...m] : []
  let result: any = value?.trim()

  if (match && match.length > 0) {
    let error = 0
    for (let i = 0; i < match.length; i++) {
      const current = match[i]
      if (current && current.index) {
        const cascade_match = [...current[0].matchAll(cascadeHashtag)]
        if (cascade_match && cascade_match.length > 1) {
          //iterate over array
          let source = opt
          //   //NOTE: flatmap sonuçları aynı array içerisine gömerek veriyor

          for (let j = 0; j < cascade_match.length; j++) {
            const cascade = cascade_match[j]
            if (isArray(source)) {
              source = map(source, (n) => get(n, cascade[1]))
            } else {
              const resultVal = get(source, cascade[1])

              if (isArray(resultVal)) source = resultVal
            }
          }
          return source
        } else {
          let resultVal = get(opt, current[1])
          if (match.length == 1 && (isObject(resultVal) || isUndefined(resultVal))) {
            result = resultVal
          } else {
            if (resultVal == undefined) resultVal = ''
            result = replaceFrom(result, current[0], `${resultVal}`, current.index - error)
            error += current[0].length - `${resultVal}`.length
          }
        }
      }
    }
  }
  return result
}

function replaceFrom(input: string, search: string, replace: string, start = 0) {
  return input.slice(0, start) + input.slice(start).replace(search, replace)
}

export function parseJSONorReturnBack(value: any): any {
  try {
    return JSON.parse(value as string)
  } catch (e) {
    return value
  }
}

export function stringifyOrReturnBack(value: any): string {
  try {
    return JSON.stringify(value as string)
  } catch (e) {
    return value
  }
}
