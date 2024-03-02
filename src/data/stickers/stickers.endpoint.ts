import type { IEndpoints } from '../main.interface'

const stickerServicePath = import.meta.env.APP_STICKER_SERVICE_API_URL
export const eStickers: IEndpoints = {
  search: {
    method: 'get',
    url: `${stickerServicePath}/search`,
  },
  searchCategories: {
    method: 'get',
    url: `${stickerServicePath}/categories`,
  },
  searchAutocomplete: {
    method: 'get',
    url: `${stickerServicePath}/autocomplete`,
  },
  trending: {
    method: 'get',
    url: `${stickerServicePath}/trending`
  },
}
