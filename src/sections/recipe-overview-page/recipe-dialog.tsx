import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Stack,
  ImageList,
  ImageListItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import * as Yup from 'yup';
import useFormFields from '@/hooks/use-form-fields';
import Recipe from '@/types/recipe';
import useFetch from '@/hooks/use-fetch';
import FirebaseStorageProvider from '@/libs/storage-providers/providers/FirebaseStorageProvider';
import { createGuid } from '@/libs/create-guid';
import ImageUploader from '@/libs/file-uploader';

function RecipeDialog({
  open,
  onClose,
  onSave,
  recipeData,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (id: string | undefined, data: Recipe) => void;
  recipeData?: Recipe;
}) {
  const [isEditing, setIsEditing] = useState(false); // If no recipe data is provided, default to editing mode

  const [, setImage] = useState(recipeData?.image || null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadFileName] = useState<string | null>(createGuid());

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
  };

  const handleCloseFullImage = () => {
    setSelectedImage(null);
  };

  const defaultValues = {
    name: '',
    description: '',
    url: '',
    ingredients: [''],
    instructions: [''],
    image: '',
    images: [],
    cuisine: [''],
    score: 0,
    comments: '',
    cookingTime: 0,
    nutrition: 0,
    category: '',
    keywords: [''],
    dateAdded: '',
    numberOfServings: 2,
  };

  const { formFields, formik } = useFormFields(
    [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        validation: Yup.string().required('Recipe name is required').min(3, 'Minimum 3 characters'),
        props: { fullWidth: true, variant: 'outlined' },
        customOptions: {
          editMode: isEditing,
        },
      },
      {
        name: 'description',
        label: 'Description',
        type: 'text',
        props: { fullWidth: true, variant: 'outlined' },
      },
      {
        name: 'cuisine',
        label: 'Cuisine',
        type: 'list',
        validation: Yup.array().of(Yup.string()),
      },
      {
        name: 'ingredients',
        label: 'Ingredients',
        type: 'list',
        initialValue: [recipeData?.ingredients || ['']],
        validation: Yup.array().of(Yup.string()),
      },
      {
        name: 'instructions',
        label: 'Instructions',
        type: 'list',
        initialValue: [recipeData?.instructions || ['']],
        validation: Yup.array().of(Yup.string()),
        customOptions: {
          numbered: true,
        },
      },
      {
        name: 'cookingTime',
        label: 'Cooking Time',
        type: 'text',
        props: { fullWidth: true, variant: 'outlined' },
      },
      {
        name: 'comments',
        label: 'Comments',
        type: 'text',
        props: { fullWidth: true, variant: 'outlined' },
      },
      {
        name: 'score',
        label: 'Score',
        type: 'text',
        props: { fullWidth: true, variant: 'outlined' },
      },
      {
        name: 'url',
        label: 'URL',
        type: 'text',
        props: { fullWidth: true, variant: 'outlined' },
      },
      {
        name: 'nutrition',
        label: 'Nutrition info',
        type: 'text',
        props: { fullWidth: true, variant: 'outlined' },
      },
      {
        name: 'numberOfServings',
        label: 'Number of Servings',
        type: 'text',
        props: { fullWidth: true, variant: 'outlined' },
      },
      {
        name: 'dateAdded',
        label: 'Date added',
        type: 'text',
        props: { fullWidth: true, variant: 'outlined', type: 'date' },
      },
      {
        name: 'keywords',
        label: 'Keywords',
        type: 'list',
        initialValue: [recipeData?.keywords || ['']],
        validation: Yup.array().of(Yup.string()),
      },
    ],
    isEditing,
    {
      initialValues: defaultValues,
      onSubmit: (values: Recipe) => {
        if (!values.id) {
          values.createdAt = new Date().toISOString();
        }
        values.updatedAt = new Date().toISOString();
        onSave(recipeData?.id, values);
        setIsEditing(false);
        onClose();
      },
    }
  );

  // // Set editing mode to true if no recipe data is provided
  // useEffect(() => {
  //   if (!formik.values?.id && !isEditing) {
  //     setIsEditing(true);
  //   }
  // }, [formik.values, isEditing]);

  // Fetch recipe data from api
  const {
    data: externalRecipeData,
    loading,
    error,
    fetchData,
  } = useFetch<any>(`https://api.appelent.site/recipes?url=${formik.values.url}`, {
    autoFetch: false,
  });

  console.log(error);

  useEffect(() => {
    if (externalRecipeData) {
      formik.setValues({
        ...formik.values,
        name: externalRecipeData.name || '',
        description: externalRecipeData.description || '',
        image: externalRecipeData.image?.[0] ? externalRecipeData.image[0] : null,
        images: externalRecipeData.image || [],
        ingredients: externalRecipeData.recipeIngredient || [],
        instructions: externalRecipeData.recipeInstructions?.map((i: any) => i.text) || [],
        cuisine: externalRecipeData.recipeCuisine || [],
      });
      //formik.handleSubmit();
    }
  }, [externalRecipeData]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (recipeData) {
      formik.setValues({
        ...defaultValues,
        ...recipeData,
      });
      setImage(recipeData.image || null);
    } else {
      formik.resetForm();
      setImage(null);
    }
  }, [recipeData]);

  // Toggle between viewing and editing mode
  const toggleEditMode = () => setIsEditing(!isEditing);

  // Handle image upload
  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        fullScreen={fullScreen}
      >
        <DialogTitle>
          {isEditing ? (recipeData ? 'Edit Recipe' : 'Add Recipe') : 'View Recipe'}
          <IconButton
            onClick={toggleEditMode}
            style={{ marginLeft: '8px' }}
          >
            {isEditing ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            {/* {isEditing ? (
              <TextField
                label="Recipe Name"
                fullWidth
                margin="normal"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            ) : (
              <Typography
                variant="body1"
                margin="normal"
              >
                {formik.values.name}
              </Typography>
            )} */}
            {formik.values?.image && (
              <Box
                display="flex"
                justifyContent="center"
                mt={2}
              >
                <img
                  src={formik.values.image}
                  alt="Recipe"
                  width="100%"
                  style={{ borderRadius: '8px' }}
                />
              </Box>
            )}
            {formFields['name']}
            {formFields['description']}
            {/* {isEditing ? (
              <TextField
                label="Recipe URL"
                fullWidth
                margin="normal"
                name="url"
                value={formik.values.url}
                onChange={formik.handleChange}
              />
            ) : (
              <Typography
                variant="body1"
                margin="normal"
              >
                {formik.values.url}
              </Typography>
            )} */}
            <Stack
              spacing={2}
              direction="row"
            >
              <Box>{formFields['url']}</Box>
              {formik.values.url && (
                <Box>
                  <Button
                    variant="contained"
                    disabled={loading}
                    //href="#" //{formik.values.url}
                    onClick={() => {
                      fetchData();
                    }}
                  >
                    Get recipe information
                  </Button>
                </Box>
              )}
            </Stack>
            <Typography
              variant="h6"
              sx={{ mt: 2 }}
            >
              Cuisine
            </Typography>
            {formFields['cuisine']}
            <Typography
              variant="h6"
              sx={{ mt: 2 }}
            >
              Ingredients
            </Typography>
            {/* <List dense>
              {formik.values.ingredients.map((ingredient, index) => (
                <ListItem key={index}>
                  <ListItemText>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        margin="dense"
                        value={ingredient}
                        onChange={(e) => {
                          const newIngredients = [...formik.values.ingredients];
                          newIngredients[index] = e.target.value;
                          formik.setFieldValue('ingredients', newIngredients);
                        }}
                      />
                    ) : (
                      <Typography variant="body2">{ingredient}</Typography>
                    )}
                  </ListItemText>
                  {isEditing && (
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => deleteLine('ingredients', index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
            </List> */}
            {/* {isEditing && (
              <Button
                onClick={() => addLine('ingredients')}
                fullWidth
                variant="outlined"
                style={{ marginBottom: '10px' }}
              >
                Add Ingredient
              </Button>
            )} */}
            {formFields['ingredients']}
            <Typography
              variant="h6"
              sx={{ mt: 2 }}
            >
              Instructions
            </Typography>
            {/* <List dense>
              {formik.values.instructions.map((instruction: any, index: number) => (
                <ListItem key={index}>
                  <ListItemText>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        margin="dense"
                        value={instruction}
                        onChange={(e) => {
                          const newInstructions = [...formik.values.instructions];
                          newInstructions[index] = e.target.value;
                          formik.setFieldValue('instructions', newInstructions);
                        }}
                      />
                    ) : (
                      <Typography variant="body2">{instruction}</Typography>
                    )}
                  </ListItemText>
                  {isEditing && (
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => deleteLine('instructions', index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
            </List>
            {isEditing && (
              <Button
                onClick={() => addLine('instructions')}
                fullWidth
                variant="outlined"
                style={{ marginBottom: '10px' }}
              >
                Add Instruction
              </Button>
            )} */}
            {formFields['instructions']}
            {/* {isEditing ? (
              <TextField
                label="Score (out of 10)"
                type="number"
                fullWidth
                margin="normal"
                name="score"
                value={formik.values.score}
                onChange={formik.handleChange}
              />
            ) : (
              <Typography
                variant="body1"
                margin="normal"
              >
                {formik.values.score}
              </Typography>
            )} */}
            {formFields['score']}
            {/* {isEditing ? (
              <TextField
                label="Comments"
                fullWidth
                multiline
                rows={3}
                margin="normal"
                name="comments"
                value={formik.values.comments}
                onChange={formik.handleChange}
              />
            ) : (
              <Typography
                variant="body1"
                margin="normal"
              >
                {formik.values.comments}
              </Typography>
            )} */}
            {formFields['comments']}
            {/* {isEditing ? (
              <TextField
                label="Cooking Time (in minutes)"
                type="number"
                fullWidth
                margin="normal"
                name="cookingTime"
                value={formik.values.cookingTime}
                onChange={formik.handleChange}
              />
            ) : (
              <Typography
                variant="body1"
                margin="normal"
              >
                {formik.values.cookingTime} minutes
              </Typography>
            )} */}
            {formFields['cookingTime']}
            {/* {isEditing ? (
              <TextField
                label="Nutrition"
                type="number"
                fullWidth
                margin="normal"
                name="nutrition"
                value={formik.values.nutrition}
                onChange={formik.handleChange}
              />
            ) : (
              <Typography
                variant="body1"
                margin="normal"
              >
                {formik.values.nutrition}
              </Typography>
            )} */}
            {formFields['nutrition']}
            {/* {isEditing ? (
              <TextField
                label="Category"
                fullWidth
                margin="normal"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
              />
            ) : (
              <Typography
                variant="body1"
                margin="normal"
              >
                {formik.values.category}
              </Typography>
            )} */}
            {formFields['category']}
            <Typography
              variant="h6"
              sx={{ mt: 2 }}
            >
              Keywords
            </Typography>
            {/* <List dense>
              {formik.values.keywords.map((keyword, index) => (
                <ListItem key={index}>
                  <ListItemText>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        margin="dense"
                        value={keyword}
                        onChange={(e) => {
                          const newKeywords = [...formik.values.keywords];
                          newKeywords[index] = e.target.value;
                          formik.setFieldValue('keywords', newKeywords);
                        }}
                      />
                    ) : (
                      <Typography variant="body2">{keyword}</Typography>
                    )}
                  </ListItemText>
                  {isEditing && (
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => deleteLine('keywords', index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
            </List>
            {isEditing && (
              <Button
                onClick={() => addLine('keywords')}
                fullWidth
                variant="outlined"
                style={{ marginBottom: '10px' }}
              >
                Add Keyword
              </Button>
            )} */}
            {formFields['keywords']}
            {/* {isEditing ? (
              <TextField
                label="Date Added"
                type="date"
                fullWidth
                margin="normal"
                name="dateAdded"
                value={formik.values.dateAdded}
                onChange={formik.handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            ) : (
              <Typography
                variant="body1"
                margin="normal"
              >
                {formik.values.dateAdded}
              </Typography>
            )} */}
            {formFields['dateAdded']}

            {/* {isEditing ? (
              <TextField
                label="Number of Servings"
                type="number"
                fullWidth
                margin="normal"
                name="numberOfServings"
                value={formik.values.numberOfServings}
                onChange={formik.handleChange}
              />
            ) : (
              <Typography
                variant="body1"
                margin="normal"
              >
                {formik.values.numberOfServings}
              </Typography>
            )} */}
            {formFields['numberOfServings']}

            {isEditing && (
              <Button
                variant="contained"
                component="label"
                fullWidth
                style={{ marginTop: '10px' }}
              >
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
              </Button>
            )}
            {formik.values.images && formik.values.images.length > 0 && (
              <ImageList
                cols={formik.values.images?.length}
                gap={8}
                rowHeight={160}
              >
                {formik.values.images.map((src: string, index: number) => (
                  <ImageListItem key={index}>
                    <img
                      src={src}
                      alt={`Image ${index + 1}`}
                      loading="lazy"
                      onClick={() => handleImageClick(src)}
                      style={{
                        width: 150,
                        height: 150,
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
            <ImageUploader
              originalFileName={`/uploads/recipes/${recipeData?.id || createGuid()}/${uploadFileName}.jpg`}
              crop={{
                uploadFile: async (file) => {
                  const filepath = `/uploads/recipes/${recipeData?.id || createGuid()}/${uploadFileName}-cropped.jpg`;
                  // Save the original file to storage
                  const storageClass = new FirebaseStorageProvider({} as any, { instance: {} });
                  const originalFileUrl = await storageClass.uploadFile(file, filepath);
                  //console.log('Original file uploaded:', originalFileUrl);
                  // update state with the type url
                  //setImageUrl((prev: any) => ({ ...prev, [type]: originalFileUrl }));
                  formik.setFieldValue('image', originalFileUrl);
                  return originalFileUrl;
                },
                path: `/uploads/recipes/${recipeData?.id || createGuid()}/${uploadFileName}-cropped.jpg`,
                aspect: 16 / 9,
              }}
              uploadFile={async (file) => {
                const filepath = `/uploads/recipes/${recipeData?.id || createGuid()}/${uploadFileName}.jpg`;
                // Save the original file to storage
                const storageClass = new FirebaseStorageProvider({} as any, { instance: {} });
                const originalFileUrl = await storageClass.uploadFile(file, filepath);
                //console.log('Original file uploaded:', originalFileUrl);
                // update state with the type url
                //setImageUrl((prev: any) => ({ ...prev, [type]: originalFileUrl }));
                return originalFileUrl;
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={onClose}
              color="secondary"
            >
              Cancel
            </Button>
            {isEditing && (
              <Button
                type="submit"
                color="primary"
              >
                Save
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
      {/* Full Image Dialog */}
      <Dialog
        open={Boolean(selectedImage)}
        onClose={handleCloseFullImage}
        maxWidth="md"
      >
        <DialogContent>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full size"
              style={{ width: '100%', height: 'auto' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              formik.setValues({ ...formik.values, image: selectedImage });
              setSelectedImage(null);
            }}
            color="primary"
          >
            Set as main image
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default RecipeDialog;
