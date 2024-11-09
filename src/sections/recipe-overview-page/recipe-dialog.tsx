// @ts-nocheck
import JsonViewer from '@andypf/json-viewer/dist/esm/react/JsonViewer';

import ImageUploader from '@/components/default/image-uploader';
import LoadingButton from '@/components/default/loading-button';
import useFetch from '@/hooks/use-fetch';
import { useAuth } from '@/libs/auth';
import { FieldConfig, FieldDefinitionConfig, useFormFields } from '@/libs/forms';
import { DefaultTextField } from '@/libs/forms/default-fields';
import FirebaseStorageProvider from '@/libs/storage-providers/providers/FirebaseStorageProvider';
import { recipeYupSchema } from '@/schemas/recipe';
import Recipe from '@/types/recipe';
import { createGuid } from '@/utils/create-guid';
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

const parseExternalRecipeData = (data: any): Recipe => {
  return {
    ...(data.title && data.title.trim() && { name: data.title }),
    ...(data.description &&
      data.description.trim() && {
        description: data.description,
      }),
    //TODO: cooking times
    ...(data.yields &&
      data.yields.trim() && {
        yields: data.yields,
      }),
    ...(data.nutrients && {
      nutrients: data.nutrients,
    }),
    ...(data.image && data.image.trim() && { image: data.image }),
    ...(data.ingredients &&
      data.ingredients.length > 0 && {
        ingredients: data.ingredients,
      }),
    ...(data.instructions_list &&
      data.instructions_list.length > 0 && {
        instructions: data.instructions_list,
      }),
    ...(data.category &&
      data.category.trim() && {
        category: data.category,
      }),
    ...(data.keywords &&
      data.keywords.length > 0 && {
        keywords: data.keywords,
      }),
    ...(data.cuisine &&
      data.cuisine.trim() && {
        cuisine: data.cuisine.split(','),
      }),

    // external data
    ...(data.site_name && data.site_name.trim() && { site: data.site_name }),
    raw: data,
  };
};

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
  setRecipe: (data: Recipe, id: string | undefined) => any;
  updateRecipe: (data: Partial<Recipe>, id: string) => void;
  deleteRecipe: (id: string) => void;
  recipeId?: string;
  setRecipeId: (id: string) => void;
  recipes: Recipe[];
}) {
  const auth = useAuth();
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
  //const [, setImage] = useState(recipe?.image || null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadFileName] = useState<string | null>(createGuid());

  // const defaultValues = {
  //   name: '',
  //   description: '',
  //   url: '',
  //   ingredients: [''],
  //   instructions: [''],
  //   image: '',
  //   images: [],
  //   cuisine: [''],
  //   score: 0,
  //   comments: '',
  //   cookingTime: 0,
  //   nutrition: 0,
  //   category: '',
  //   keywords: [''],
  //   numberOfServings: 2,
  // };

  const fields: FieldConfig[] = useMemo(
    () => [
      {
        name: 'name',
        label: 'Name',
        validation: (value: any) => recipeYupSchema.validateAt('name', value),
      },
      {
        name: 'description',
        label: 'Description',
      },
      {
        name: 'cuisine',
        label: 'Cuisine',
        definition: 'list',
        custom: {
          header: true,
        },
      },
      {
        name: 'ingredients',
        label: 'Ingredients',
        definition: 'list',
        //initialValue: [recipe?.ingredients || ['']],
        custom: {
          header: true,
        },
      },
      {
        name: 'instructions',
        label: 'Instructions',
        definition: 'list',
        //initialValue: [recipe?.instructions || ['']],
        custom: {
          numbered: true,
          header: true,
        },
      },
      {
        name: 'cookingTime',
        label: 'Cooking Time',
        type: 'number',
      },
      {
        name: 'comments',
        label: 'Comments',
      },
      {
        name: 'score',
        label: 'Score',
        type: 'number',
      },
      {
        name: 'url',
        label: 'URL',
      },
      {
        name: 'nutrition',
        label: 'Nutrition info',
        type: 'number',
      },
      {
        name: 'category',
        label: 'Category',
      },
      {
        name: 'numberOfServings',
        label: 'Number of Servings',
        render: ({ field, formik, options, helpers }: FieldDefinitionConfig) => {
          return (
            <DefaultTextField
              field={field}
              formik={formik}
              options={options}
              helpers={helpers}
            />
          );
        },
      },
      {
        name: 'keywords',
        label: 'Keywords',
        type: 'list',
        //initialValue: [recipe?.keywords || ['']],
      },
      {
        //id: 'calories',
        name: 'nutrients.calories',
        type: 'object',
        //accessor: 'nutrients.calories',
        label: 'Nutrients.calories',
        //initialValue: [recipe?.nutrients?.calories || ['']],
      },
    ],
    []
  );

  const { formFields, formik } = useFormFields({
    fields,
    options: {
      editMode: isEditing,
      muiTextFieldProps: {
        fullWidth: true,
        variant: 'outlined',
      },
      preSave: (values: any) => {
        const cleanedValues = { ...values };
        Object.keys(cleanedValues).forEach((key) => {
          if (Array.isArray(cleanedValues[key])) {
            cleanedValues[key] = values[key].filter((item) => item.trim() !== '');
          }
        });
        //cleanedValues.owner = auth.user?.id || 'unknown';
        if (!recipe?.id) {
          cleanedValues.createdAt = new Date().toISOString();
        }
        cleanedValues.updatedAt = new Date().toISOString();
        return cleanedValues;
      },
    },
    formikProps: {
      initialValues: {
        owner: auth.user.id,
        ...recipe,
      },
      validationSchema: recipeYupSchema,
      enableReinitialize: true,
      onSubmit: async (values: Recipe) => {
        const savedRecipe = await setRecipe(values, recipe?.id);
        if (recipeId === 'new') {
          setRecipeId(savedRecipe.id);
        }
        setIsEditing(false);
      },
    },
  });

  console.log(formik);

  // Fetch recipe data from api
  const {
    data: externalRecipeData,
    loading,
    fetchData,
  } = useFetch<any>(`https://api-python.appelent.site/recipes/scrape?url=${formik.values.url}`, {
    autoFetch: false,
  });

  useEffect(() => {
    if (externalRecipeData) {
      console.log(externalRecipeData);
      if (externalRecipeData && externalRecipeData.status === 'success') {
        formik.setValues({
          ...formik.values,
          ...parseExternalRecipeData(externalRecipeData.data),
        });
      }
      //formik.handleSubmit();
    }
  }, [externalRecipeData]);

  // useEffect(() => {
  //   console.log('DEFAULT VALUES', recipeDefaultValues, recipe);

  //   if (recipe) {
  //     // formik.setValues({
  //     //   //...defaultValues,
  //     //   ...recipe,
  //     // });
  //     setImage(recipe.image || null);
  //   } else {
  //     //formik.resetForm();
  //     setImage(null);
  //   }
  // }, [recipe]);

  // useEffect(() => {
  //   console.log('USER', auth.user);
  //   if (auth?.user?.id && formik.values.owner !== auth.user.id) {
  //     const user = auth.user?.id;
  //     formik.setFieldValue('owner', user);
  //   }
  // }, [auth.user]);

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
            {!isEditing && (
              <IconButton
                onClick={toggleEditMode}
                //disabled={disableSubmit} // Disable edit button if adding new recipe
                style={{ marginLeft: '8px' }}
              >
                {<EditIcon />}
              </IconButton>
            )}
            {isEditing && (
              <IconButton
                onClick={formik.handleSubmit}
                disabled={disableSubmit}
                style={{ marginLeft: '8px' }}
              >
                {<SaveIcon />}
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
                    <LoadingButton
                      variant="contained"
                      isLoading={loading}
                      //href="#" //{formik.values.url}
                      onClick={() => {
                        fetchData();
                      }}
                    >
                      Get recipe information
                    </LoadingButton>
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
            {formFields['numberOfServings']}
            {formFields['nutrients.calories']}
            {formik.values.images && formik.values.images.length > 0 && (
              <RecipeDialogImageList
                images={formik.values.images}
                setSelectedImage={setSelectedImage}
              />
            )}
            <ImageUploader
              originalFileName={`/uploads/recipes/${recipe?.id || createGuid()}/${uploadFileName}.jpg`}
              uploadFile={async (file, filename) => {
                // Save the original file to storage
                const storageClass = new FirebaseStorageProvider({} as any, { instance: {} });
                const originalFileUrl = await storageClass.uploadFile(file, filename);
                return originalFileUrl;
              }}
              crop={{
                path: `/uploads/recipes/${recipe?.id || createGuid()}/${uploadFileName}-cropped.jpg`,
                uploadFile: async (file, filename) => {
                  // Save the original file to storage
                  const storageClass = new FirebaseStorageProvider({} as any, { instance: {} });
                  const originalFileUrl = await storageClass.uploadFile(file, filename);
                  // update state with the type url
                  formik.setFieldValue('image', originalFileUrl);
                  return originalFileUrl;
                },
                props: { aspect: 16 / 9 },
              }}
            />
            <JsonViewer
              data={formik.values}
              expanded={false}
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
