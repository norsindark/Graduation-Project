import { Area } from 'react-easy-crop/types';

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on the canvas
    image.src = url;
  });

export default async function getCroppedImg(
  imageSrc: string,
  crop: Area
): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  const { width, height } = crop;
  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(image, crop.x, crop.y, width, height, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], 'croppedImage.jpg', { type: 'image/jpeg' }));
      } else {
        reject(new Error('Failed to crop image'));
      }
    }, 'image/jpeg');
  });
}
