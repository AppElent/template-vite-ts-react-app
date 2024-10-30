// @ts-nocheck
export const getCroppedImg = (imageSrc, crop): BlobPart => {
  const image = new Image();
  image.src = imageSrc;

  return new Promise((resolve) => {
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    };
  });
};
