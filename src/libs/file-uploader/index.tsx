// @ts-nocheck

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './cropImage';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import useDialog from '@/hooks/use-dialog';

interface ImageUploaderProps {
  originalFileName: string;
  uploadFile: (file: File, path: string) => Promise<string>;
  max_size?: number;
  crop: {
    uploadFile: (file: File, path: string) => Promise<string>;
    path: string;
    aspect: number;
  };
  thumbnail?: {
    uploadFile: (file: File, path: string) => Promise<string>;
    path: string;
    dimensions: {
      width: number;
      height: number;
    };
  };
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const ImageUploader = ({
  originalFileName,
  uploadFile,
  max_size = MAX_FILE_SIZE,
  crop: cropObject,
  thumbnail,
}: ImageUploaderProps) => {
  const [imageSrc, setImageSrc] = useState<string>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const dialog = useDialog();

  const getFileName = (path: string): string => {
    return path.split('/').pop() || 'unknown-filename.jpg';
  };

  const resizeImage = (file: File, maxSize: number): Promise<File> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        const scaleSize = maxSize / img.width;
        canvas.width = maxSize;
        canvas.height = img.height * scaleSize;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          }
        }, 'image/jpeg');
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const onFileChange = async (e: any) => {
    let file = e.target.files[0];
    if (file) {
      if (file.size > max_size) {
        console.log(
          `Resizing image to 1000px width. Current size: ${file.size}, max size: ${max_size}`
        );
        file = await resizeImage(file, 1000); // Resize to 1000px width
        console.log(`Resized image size: ${file.size}`);
      }

      if (cropObject?.path) {
        const url = URL.createObjectURL(file);
        setImageSrc(url);
        dialog.open();
      }

      const originalFileUrl = await uploadFile(file, originalFileName);
      console.log('Original file uploaded:', originalFileUrl);

      if (thumbnail?.path) {
        const thumbnailBlob = await createThumbnail(file);
        const thumbnailFile = new File([thumbnailBlob], getFileName(thumbnail.path), {
          type: 'image/jpeg',
        });
        const uploadFunction = thumbnail.uploadFile || uploadFile;
        const thumbnailFileUrl = await uploadFunction(thumbnailFile, thumbnail.path);
        console.log('Thumbnail file uploaded:', thumbnailFileUrl);
      }
    }
  };

  const onCropComplete = useCallback((_, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const saveCroppedImage = async () => {
    if (imageSrc && croppedAreaPixels) {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

      const croppedFile = new File([croppedImageBlob], getFileName(cropObject.path), {
        type: 'image/jpeg',
      });
      const uploadFunction = cropObject.uploadFile || uploadFile;
      const croppedFileUrl = await uploadFunction(croppedFile, cropObject.path);
      console.log('Cropped file uploaded:', croppedFileUrl);
      dialog.close();
    }
  };

  const createThumbnail = async (file: File) => {
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    return new Promise((resolve) => {
      img.onload = () => {
        const scaleSize = 100 / img.width;
        canvas.width = 100;
        canvas.height = img.height * scaleSize;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, 'image/jpeg');
      };
      img.src = URL.createObjectURL(file);
    });
  };

  return (
    <div>
      <input
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
      </label>
      <Dialog
        open={dialog.isOpen}
        onClose={() => dialog.open()}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Crop Image</DialogTitle>
        <DialogContent>
          {imageSrc && cropObject.path && (
            <div style={{ position: 'relative', width: '100%', height: 400 }}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={cropObject?.aspect || 1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => dialog.close()}
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

export default ImageUploader;
