export function useSizedImage (files: any[], size = 'HD') {
  let sizedImage = null
  if (!files) return null
  files.forEach((file) => {
    if (file.sizedImages && Object.keys(file.sizedImages).length > 0) {
      if (file.sizedImages.webp) {
        const img = file.sizedImages.webp.find((i) => i.imageSizeType == size)
        sizedImage = img?.path
      }
      else if (file.sizedImages.jpeg) {
        const img = file.sizedImages.jpeg.find((i) => i.imageSizeType == size)
        sizedImage = img?.path
      }
    } else sizedImage = file.path
  })
  if (sizedImage) return sizedImage
  else return null
}