// @ts-nocheck

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface ImageCropperProps {
  imageUrl: string;
  filename: string;
  onSave: (file: File, path: string) => Promise<string>;
  dialog?: {
    isOpen: boolean;
    //open: () => void;
    close: () => void;
  };
  cropperProps?: any;
  //   uploadFile: (file: File, path: string) => Promise<string>;
  //   max_size?: number;
  //   crop: {
  //     uploadFile: (file: File, path: string) => Promise<string>;
  //     path: string;
  //     aspect: number;
  //   };
  //   thumbnail: {
  //     uploadFile: (file: File, path: string) => Promise<string>;
  //     path: string;
  //     dimensions: {
  //       width: number;
  //       height: number;
  //     };
  //   };
}

async function convertImageToDataURL(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const getCroppedImg = async (imageSrc: string, crop: any) => {
  const image = new Image();
  const dataUrl = await convertImageToDataURL(imageSrc);
  image.src = dataUrl;

  return new Promise((resolve) => {
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');

      ctx?.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    };
  });
};

const ImageCropper = ({
  imageUrl,
  filename,
  onSave,
  dialog,
  cropperProps,
  //   max_size = MAX_FILE_SIZE,
  //   crop: cropObject,
  //   thumbnail,
}: ImageCropperProps) => {
  //const [imageSrc, setImageSrc] = useState<string>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  //const dialog = useDialog();

  const getFileName = (path: string): string => {
    return path.split('/').pop() || 'unknown-filename.jpg';
  };

  //   const onFileChange = async (e: any) => {
  //     let file = e.target.files[0];
  //     if (file) {
  //       if (file.size > max_size) {
  //         console.log(
  //           `Resizing image to 1000px width. Current size: ${file.size}, max size: ${max_size}`
  //         );
  //         file = await resizeImage(file, 1000); // Resize to 1000px width
  //         console.log(`Resized image size: ${file.size}`);
  //       }

  //       if (cropObject?.path) {
  //         const url = URL.createObjectURL(file);
  //         setImageSrc(url);
  //         dialog.open();
  //       }

  //       const originalFileUrl = await uploadFile(file, originalFileName);
  //       console.log('Original file uploaded:', originalFileUrl);

  //       if (thumbnail.path) {
  //         const thumbnailBlob = await createThumbnail(file);
  //         const thumbnailFile = new File([thumbnailBlob], getFileName(thumbnail.path), {
  //           type: 'image/jpeg',
  //         });
  //         const uploadFunction = thumbnail.uploadFile || uploadFile;
  //         const thumbnailFileUrl = await uploadFunction(thumbnailFile, thumbnail.path);
  //         console.log('Thumbnail file uploaded:', thumbnailFileUrl);
  //       }
  //     }
  //   };

  const onCropComplete = useCallback((_, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const saveCroppedImage = async () => {
    if (imageUrl && croppedAreaPixels) {
      const croppedImageBlob = await getCroppedImg(imageUrl, croppedAreaPixels);

      const croppedFile = new File([croppedImageBlob], getFileName(filename), {
        type: 'image/jpeg',
      });
      const croppedFileUrl = await onSave(croppedFile, filename);
      console.log('Cropped file uploaded:', croppedFileUrl);
      dialog?.close();
    }
  };

  return (
    <div>
      {/* <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{ display: 'none' }}
        id="upload-button"
      />
      <label htmlFor="upload-button">
        <Button
          variant="contained"
          color="primary"
          component="span"
        >
          Upload Image
        </Button>
      </label> */}
      <Dialog
        open={dialog?.isOpen || false}
        onClose={() => dialog?.close()}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Crop Image</DialogTitle>
        <DialogContent>
          {imageUrl && (
            <div style={{ position: 'relative', width: '100%', height: 400 }}>
              <Cropper
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                aspect={cropperProps?.aspect || 1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => dialog?.close()}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={saveCroppedImage}
            color="primary"
          >
            Save Image
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ImageCropper;
