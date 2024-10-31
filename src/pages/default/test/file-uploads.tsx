// @ts-nocheck

import { useAuth } from '@/libs/auth';
import FirebaseStorageProvider from '@/libs/storage-providers/providers/FirebaseStorageProvider';
import ImageUploaderCard from '@/sections/default/test/file-uploads/ImageUploaderCard';
import SimpleCropper from '@/sections/default/test/file-uploads/simple-cropper';
import { Card, CardContent, CardHeader, Grid } from '@mui/material';
import DefaultPaperbasePage from '../DefaultPaperbasePage';

const CardLayout = ({ title, children }) => {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>{children}</CardContent>
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
          <CardLayout title="Image uploader with cropping and thumbnail">
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
          </CardLayout>
        </Grid>
        <Grid item>
          <CardLayout title="Simple Cropper">
            <SimpleCropper
              filename={`uploads/test/${auth.user?.id || 'unknown'}/simplecropper/testimage.jpg`}
            />
          </CardLayout>
        </Grid>
      </Grid>
    </DefaultPaperbasePage>
  );
};

export default FileUploads;
