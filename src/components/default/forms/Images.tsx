import { FieldConfig } from '@/libs/forms';
import useFormField from '@/libs/forms/use-form-field';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Box, Button, Card, CardActions, CardMedia, IconButton, Typography } from '@mui/material';
import _ from 'lodash';

interface ImagesProps {
  name: string;
  field?: FieldConfig;
  uploadImage: (file: File) => Promise<string>;
  deleteImage?: (url: string) => Promise<void>;
  postProcess?: () => Promise<any>;
  getFavorite?: (url: string) => boolean;
  setFavorite?: (url: string) => void;
}

const Images = ({
  name,
  field: fieldConfig,
  uploadImage,
  deleteImage,
  postProcess,
  getFavorite,
  setFavorite,
  ...props
}: ImagesProps) => {
  const fieldName = fieldConfig ? fieldConfig.name : name;
  const data = useFormField(fieldName, fieldConfig);
  const { options, field, helpers } = data;

  // Set images variable
  const images = field.value || [];

  const newProps = _.merge({}, options, props);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // Determine if these are the first images uploaded
      const isFirstUpload = images.length === 0;
      const filesArray = Array.from(event.target.files);
      // for (const file of filesArray) {
      //   const url = await uploadImage(file);
      //   const images = field.value || [];
      //   if (images.indexOf(url) === -1) images.push(url);
      //   helpers.setValue(images);
      // }

      // // If postProcess is defined, run it
      // if (postProcess) {
      //   await postProcess();
      // }

      const newImages = filesArray.map((file) => URL.createObjectURL(file));
      // merge newImages with existing images and remove duplicates
      const uniqueImages = [...new Set([...images, ...newImages])];

      helpers.setValue(uniqueImages);
      //setImages((prev) => [...prev, ...newImages]);

      // Set first image as starred
      if (isFirstUpload && setFavorite) {
        setFavorite(newImages[0]);
      }
    }
  };

  const handleDelete = (id: string) => {
    if (deleteImage) {
      deleteImage(id);
    }
    const newValue = field.value.filter((img: string) => img !== id);
    helpers.setValue(newValue);
    // helpers.setValue((prev: string[]) => {
    //   const updatedImages = prev.filter((img) => img.id !== id);
    //   if (updatedImages.every((img) => !img.isDefault)) {
    //     updatedImages[0].isDefault = true; // Set first image as default if none exists
    //   }
    //   return updatedImages;
    // });
  };

  const handleSetFavorite = (id: string) => {
    if (setFavorite) {
      setFavorite(id);
    }
    // setImages((prev) =>
    //   prev.map((img) => ({
    //     ...img,
    //     isDefault: img.id === id,
    //   }))
    // );
  };

  return (
    <Box>
      <Typography
        variant="h6"
        gutterBottom
      >
        Upload Images
      </Typography>

      {/* Upload Button */}
      <Button
        variant="contained"
        component="label"
        startIcon={<AddPhotoAlternateIcon />}
        {...newProps?.muiButtonProps}
      >
        Upload Images
        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleUpload}
        />
      </Button>

      {/* Display Images */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        mt={3}
        justifyContent="flex-start"
      >
        {images.map((image: string) => (
          <Card
            key={image}
            sx={{ width: 150 }}
          >
            <CardMedia
              component="img"
              height="100"
              image={image}
              alt="Uploaded Image"
            />
            <CardActions>
              {/* Set Favorite */}
              {getFavorite && (
                <IconButton
                  // color={image.isDefault ? 'primary' : 'default'}
                  onClick={() => handleSetFavorite(image)}
                  //disabled={image}
                >
                  {getFavorite(image) ? (
                    <StarIcon style={{ color: '#faaf00' }} />
                  ) : (
                    <StarBorderIcon />
                  )}
                </IconButton>
              )}

              {/* Delete */}
              {deleteImage && (
                <IconButton
                  color="error"
                  onClick={() => handleDelete(image)}
                  // disabled={image.isDefault}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Images;
