//@ts-ignore
import { createImage, getRadianAngle } from './utils'; // internal helpers
//@ts-ignore
export  async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
//@ts-ignore
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
//@ts-ignore
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      //@ts-ignore
      resolve(URL.createObjectURL(file));
    }, 'image/jpeg');
  });
}
