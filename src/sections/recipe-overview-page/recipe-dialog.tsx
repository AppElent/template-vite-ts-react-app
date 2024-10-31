import useFetch from '@/hooks/use-fetch';
import useFormFields from '@/hooks/use-form-fields';
import { createGuid } from '@/libs/create-guid';
import ImageUploader from '@/libs/file-uploader';
import FirebaseStorageProvider from '@/libs/storage-providers/providers/FirebaseStorageProvider';
import { recipeYupSchema } from '@/schemas/recipe';
import Recipe from '@/types/recipe';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import RecipeDialogFullImageViewer from './recipe-dialog-full-image-viewer';
import RecipeDialogImageList from './recipe-dialog-image-list';

function RecipeDialog({
  open,
  onClose,
  //onSave,
  setRecipe,
  updateRecipe,
  deleteRecipe,
  recipeId,
  setRecipeId, // Add setRecipeId
  recipes,
}: {
  open: boolean;
  onClose: () => void;
  //onSave: (id: string | undefined, data: Recipe) => void;
  setRecipe: (id: string | undefined, data: Recipe) => any;
  updateRecipe: (id: string, data: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  recipeId?: string;
  setRecipeId: (id: string) => void;
  recipes: Recipe[];
}) {
  // Theme and media query
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Recipe information
  const [isEditing, setIsEditing] = useState(recipeId === 'new'); // If no recipe data is provided, default to editing mode
  // Toggle between viewing and editing mode
  const toggleEditMode = () => setIsEditing(!isEditing);
  // Get recipe information
  const recipe = useMemo(() => {
    if (recipeId === 'new') {
      return null;
    } else {
      return recipes.find((r) => r.id === recipeId) || null;
    }
  }, [recipeId, recipes]);

  // // Set editing mode to true if no recipe data is provided
  useEffect(() => {
    if (recipeId === 'new') {
      setIsEditing(true);
    }
  }, [recipeId]);

  // Image section
  const [, setImage] = useState(recipe?.image || null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadFileName] = useState<string | null>(createGuid());

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
        //validation: Yup.string().required('Recipe name is required').min(3, 'Minimum 3 characters'),
        validation: (value) => recipeYupSchema.validateAt('name', value),
        props: { fullWidth: true, variant: 'outlined' },
        //await schema.validateAt('foo[0].bar', rootValue); // => ValidationError: must be a string
      },
      {
        name: 'description',
        label: 'Description',
        type: 'text',
        props: { fullWidth: true, variant: 'outlined', multiline: true },
      },
      {
        name: 'cuisine',
        label: 'Cuisine',
        type: 'list',
        custom: {
          header: true,
        },
      },
      {
        name: 'ingredients',
        label: 'Ingredients',
        type: 'list',
        initialValue: [recipe?.ingredients || ['']],
        custom: {
          header: true,
        },
      },
      {
        name: 'instructions',
        label: 'Instructions',
        type: 'list',
        initialValue: [recipe?.instructions || ['']],
        custom: {
          numbered: true,
          header: true,
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
        props: {
          fullWidth: true,
          variant: 'outlined',
          type: 'number',
        },
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
        props: { fullWidth: true, variant: 'outlined', type: 'number' },
      },
      {
        name: 'numberOfServings',
        label: 'Number of Servings',
        type: 'text',
        props: { fullWidth: true, variant: 'outlined', type: 'number' },
      },
      {
        name: 'keywords',
        label: 'Keywords',
        type: 'list',
        initialValue: [recipe?.keywords || ['']],
      },
    ],
    { editMode: isEditing },
    {
      initialValues: defaultValues,
      validationSchema: recipeYupSchema,
      onSubmit: async (values: Recipe) => {
        if (!recipe?.id) {
          values.createdAt = new Date().toISOString();
        }
        values.updatedAt = new Date().toISOString();
        const savedRecipe = await setRecipe(recipe?.id, values);
        if (recipeId === 'new') {
          setRecipeId(savedRecipe.id);
        }
        console.log(savedRecipe);
        setIsEditing(false);
        //formik.resetForm();
        //onClose();
      },
    }
  );

  // Fetch recipe data from api
  const {
    data: externalRecipeData,
    loading,
    fetchData,
  } = useFetch<any>(`https://api.appelent.site/recipes?url=${formik.values.url}`, {
    autoFetch: false,
  });

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

  useEffect(() => {
    if (recipe) {
      formik.setValues({
        ...defaultValues,
        ...recipe,
      });
      setImage(recipe.image || null);
    } else {
      formik.resetForm();
      setImage(null);
    }
  }, [recipe]);

  // Conditions for disabling submit button
  const disableSubmit =
    formik.isSubmitting || loading || !formik.isValid || !formik.dirty || formik.isValidating;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        fullScreen={fullScreen}
      >
        <DialogTitle
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div>
            {isEditing ? (recipe ? 'Edit Recipe' : 'Add Recipe') : 'View Recipe'}
            {recipeId !== 'new' && (
              <IconButton
                onClick={() => {
                  if (isEditing) {
                    formik.handleSubmit();
                  } else {
                    toggleEditMode();
                  }
                }}
                disabled={recipeId === 'new' || disableSubmit} // Disable edit button if adding new recipe
                style={{ marginLeft: '8px' }}
              >
                {isEditing ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            )}
          </div>
          {isEditing && (
            <IconButton
              onClick={() => {
                setIsEditing(false);
                //formik.resetForm();
              }}
              style={{ marginLeft: '8px' }}
            >
              <CancelIcon />
            </IconButton>
          )}
          <IconButton
            onClick={onClose} // Add your close handler here
            style={{ marginLeft: 'auto' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
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
                  style={{ borderRadius: '8px', maxHeight: '300px', objectFit: 'contain' }}
                />
              </Box>
            )}
            {formFields['name']}
            {formFields['description']}
            <Grid
              container
              spacing={2}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Grid
                item
                xs={12}
                sm={formik.values.url ? 8 : 12}
              >
                <Box>{formFields['url']}</Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
              >
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
              </Grid>
            </Grid>

            {formFields['cuisine']}
            {formFields['ingredients']}
            {formFields['instructions']}
            {formFields['score']}
            {formFields['comments']}
            {formFields['cookingTime']}
            {formFields['nutrition']}
            {formFields['category']}
            {formFields['keywords']}
            {formFields['dateAdded']}
            {formFields['numberOfServings']}
            {formik.values.images && formik.values.images.length > 0 && (
              <RecipeDialogImageList
                images={formik.values.images}
                setSelectedImage={setSelectedImage}
              />
            )}
            <ImageUploader
              originalFileName={`/uploads/recipes/${recipe?.id || createGuid()}/${uploadFileName}.jpg`}
              crop={{
                uploadFile: async (file) => {
                  const filepath = `/uploads/recipes/${recipe?.id || createGuid()}/${uploadFileName}-cropped.jpg`;
                  // Save the original file to storage
                  const storageClass = new FirebaseStorageProvider({} as any, { instance: {} });
                  const originalFileUrl = await storageClass.uploadFile(file, filepath);
                  //console.log('Original file uploaded:', originalFileUrl);
                  // update state with the type url
                  //setImageUrl((prev: any) => ({ ...prev, [type]: originalFileUrl }));
                  formik.setFieldValue('image', originalFileUrl);
                  return originalFileUrl;
                },
                path: `/uploads/recipes/${recipe?.id || createGuid()}/${uploadFileName}-cropped.jpg`,
                aspect: 16 / 9,
              }}
              uploadFile={async (file) => {
                const filepath = `/uploads/recipes/${recipe?.id || createGuid()}/${uploadFileName}.jpg`;
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
              {isEditing ? 'Cancel' : 'Close'}
            </Button>
            {isEditing && (
              <Button
                type="submit"
                color="primary"
              >
                Save
              </Button>
            )}
            {recipeId !== 'new' && (
              <Button
                onClick={() => {
                  if (recipeId) {
                    deleteRecipe(recipeId);
                  }

                  formik.resetForm();
                  onClose();
                }}
                color="error"
              >
                Delete
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
      {/* Full Image Dialog */}
      <RecipeDialogFullImageViewer
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        set={(image: string) => {
          // if dialog is set to editMode, we need to update right away, otherwise just update formik state
          if (isEditing) {
            formik.setValues({ ...formik.values, image });
          } else {
            if (recipe?.id) {
              updateRecipe(recipe?.id, { image });
            }

            formik.setValues({ ...formik.values, image });
          }
        }}
      />
      {/* <Dialog
        open={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
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
      </Dialog> */}
    </>
  );
}

export default RecipeDialog;
