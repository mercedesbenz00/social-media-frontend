export const metaDefaults = {
  title: import.meta.env.APP_TITLE,
  titleTemplate: '%s',
  description: import.meta.env.APP_DESCRIPTION,
  keywords: import.meta.env.APP_KEYWORDS,
  author: import.meta.env.APP_AUTHOR,
  version: import.meta.env.APP_VERSION,
}

export const ACCESS_TOKEN = 'auth.access_token'
export const REFRESH_TOKEN = 'auth.refresh_token'
export const REMEMBER = 'auth.remember'
