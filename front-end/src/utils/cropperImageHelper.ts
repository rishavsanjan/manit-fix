// utils/cropImage.ts
export async function getCroppedImg(imageSrc: string, crop: any, zoom: number) {
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', error => reject(error))
      image.setAttribute('crossOrigin', 'anonymous') // CORS
      image.src = url
    })
    console.log(zoom)

  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const scale = image.naturalWidth / image.width
  canvas.width = crop.width
  canvas.height = crop.height

  ctx?.drawImage(
    image,
    crop.x * scale,
    crop.y * scale,
    crop.width * scale,
    crop.height * scale,
    0,
    0,
    crop.width,
    crop.height
  )

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Canvas is empty'))
      resolve(blob)
    }, 'image/jpeg')
  })
}
