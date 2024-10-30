// @ts-nocheck

import ImageUploader from '@/libs/file-uploader';
import DefaultPaperbasePage from '../DefaultPaperbasePage';
import FirebaseStorageProvider from '@/libs/storage-providers/providers/FirebaseStorageProvider';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '@/libs/auth';
import { useState } from 'react';
import ImageCropper from '@/components/default/ImageCropper';
import useDialog from '@/hooks/use-dialog';

const ImageUploaderCard = ({
  title,
  uploadFile,
  originalFileName,
  croppedFileName,
  thumbnailFileName,
}) => {
  const [imageUrl, setImageUrl] = useState<any>({});
  const uploadFileAndShowThumbnail = (type) => async (file, fileName) => {
    // Save the original file to storage
    const originalFileUrl = await uploadFile(file, fileName);
    //console.log('Original file uploaded:', originalFileUrl);
    // update state with the type url
    setImageUrl((prev: any) => ({ ...prev, [type]: originalFileUrl }));
    return originalFileUrl;
  };

  console.log(imageUrl);
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <ImageUploader
          originalFileName={originalFileName}
          crop={{
            uploadFile: uploadFileAndShowThumbnail('cropped'),
            path: croppedFileName,
            aspect: 16 / 9,
          }}
          thumbnail={{
            uploadFile: uploadFileAndShowThumbnail('thumbnail'),
            path: thumbnailFileName,
            dimensions: { width: 100, height: 100 },
          }}
          uploadFile={uploadFileAndShowThumbnail('original')}
        />
        {imageUrl.original && (
          // Show image with max size of 200px
          <Box>
            <Typography variant="h6">Original image</Typography>
            <a
              href={imageUrl.original}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={imageUrl.original}
                alt="Uploaded file"
                style={{ maxWidth: '100%', maxHeight: '200px' }}
              />
            </a>
          </Box>
        )}
        {imageUrl.cropped && (
          // Show image with max size of 200px
          <Box>
            <Typography variant="h6">Cropped image</Typography>
            <a
              href={imageUrl.cropped}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={imageUrl.cropped}
                alt="Uploaded file"
                style={{ maxWidth: '100%', maxHeight: '200px' }}
              />
            </a>
          </Box>
        )}
        {imageUrl.thumbnail && (
          // Show image with max size of 200px
          <Box>
            <Typography variant="h6">Thumbnail image</Typography>
            <a
              href={imageUrl.thumbnail}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={imageUrl.thumbnail}
                alt="Uploaded file"
                style={{ maxWidth: '100%', maxHeight: '200px' }}
              />
            </a>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const SimpleCropper = ({ filename }) => {
  const storageClass = new FirebaseStorageProvider({} as any, { instance: {} });
  const auth = useAuth();
  const dialog = useDialog();
  const [imageUrl, setImageUrl] = useState<string>();
  console.log(auth);
  const [url, setUrl] = useState('');

  return (
    <Card>
      <CardHeader title="Simple Cropper" />
      <CardContent>
        <TextField
          id="outlined-controlled"
          label="URL"
          value={url}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setUrl(event.target.value);
          }}
        />
        <Button onClick={() => dialog.open()}>Crop</Button>
        <ImageCropper
          imageUrl={url}
          filename={filename}
          onSave={async (file, path) => {
            console.log(path, file);
            // Save the original file to storage
            const originalFileUrl = await storageClass.uploadFile(file, filename);
            //console.log('Original file uploaded:', originalFileUrl);
            // update state with the type url
            //setImageUrl((prev: any) => ({ ...prev, [type]: originalFileUrl }));
            setImageUrl(originalFileUrl);
            return originalFileUrl;
            return path;
          }}
          dialog={{
            isOpen: dialog.isOpen,
            close: dialog.close,
          }}
        />
        {imageUrl && (
          // Show image with max size of 200px
          <Box>
            <Typography variant="h6">Cropped image</Typography>
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={imageUrl}
                alt="Uploaded file"
                style={{ maxWidth: '100%', maxHeight: '200px' }}
              />
            </a>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const FileUploads = () => {
  const storageClass = new FirebaseStorageProvider({} as any, { instance: {} });
  const auth = useAuth();

  return (
    <DefaultPaperbasePage title="File Uploads">
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
          md={6}
        >
          <ImageUploaderCard
            title="Image uploader with cropping and thumbnail"
            uploadFile={storageClass.uploadFile}
            uploadOriginal={true}
            uploadCropped={true}
            uploadThumbnail={true}
            originalFileName={`uploads/test/${auth.user?.id || 'unknown'}/original/testimage.jpg`}
            croppedFileName={`uploads/test/${auth.user?.id || 'unknown'}/cropped/testimage.jpg`}
            thumbnailFileName={`uploads/test/${auth.user?.id || 'unknown'}/thumbnail/testimage.jpg`}
          />
        </Grid>
        <Grid item>
          <SimpleCropper
            filename={`uploads/test/${auth.user?.id || 'unknown'}/simplecropper/testimage.jpg`}
          />
        </Grid>
      </Grid>
    </DefaultPaperbasePage>
  );
};

export default FileUploads;
