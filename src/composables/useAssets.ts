const assets = import.meta.globEager('@/assets/images/**')
export function useAssets(url: string) {
  const asset = assets['../assets/images/' + url]
  if (asset) return asset.default
  return url
}
