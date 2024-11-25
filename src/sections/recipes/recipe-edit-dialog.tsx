// @ts-nocheck

import AutocompleteChipList from '@/components/default/forms/AutocompleteChipList';
import CancelButton from '@/components/default/forms/CancelButton';
import Images from '@/components/default/forms/Images';
import List from '@/components/default/forms/List';
import Rating from '@/components/default/forms/Rating';
import SubmitButton from '@/components/default/forms/SubmitButton';
import TextField from '@/components/default/forms/TextField';
import JsonEditor from '@/components/default/json-editor';
import GridLayout from '@/components/default/ui/grid-layout';
import { getLogLevel } from '@/config';
import { RECIPE_FIELDS } from '@/data/recipe-data';
import useFetch from '@/hooks/use-fetch';
import useGuid from '@/hooks/use-guid';
import useQueryParamAction from '@/hooks/use-query-param-action';
import useRouter from '@/hooks/use-router';
import { useAuth } from '@/libs/auth';
import { useData } from '@/libs/data-sources';
import { CustomForm } from '@/libs/forms';
import useCustomFormik from '@/libs/forms/use-custom-formik';
import { getCuisineSuggestions, getKeywordSuggestions } from '@/libs/recipes/get-recipe-fields';
import parseExternalRecipeData from '@/libs/recipes/parse-external-recipe-data';
import FirebaseStorageProvider from '@/libs/storage-providers/providers/FirebaseStorageProvider';
import { ExternalRecipe } from '@/schemas/external-recipe';
import { recipeYupSchema } from '@/schemas/recipe';
import Recipe from '@/types/recipe';
import CloseIcon from '@mui/icons-material/Close';
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
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useMemo } from 'react';
import LoadingButton from '../../components/default/ui/loading-button';

interface RecipeEditDialogProps {
  recipe?: Recipe | null;
  open: boolean;
  onClose: () => void;
}

const RecipeEditDialog = ({ recipe, open, onClose }: RecipeEditDialogProps) => {
  const auth = useAuth();
  // Theme and media query
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Generate new ID
  const id = useGuid();
  const recipeId = recipe?.id || id;

  const { data: recipes, actions: recipeActions } = useData('recipes');

  // Receive url query param and fetch recipe data
  useQueryParamAction('url', (url) => {
    const fetchDataAndUpdateFormik = async () => {
      await formik.setFieldValue('url', url);
      await fetchData(`https://api-python.appelent.site/recipes/scrape?url=${url}`);
    };
    if (url && formik.values.url !== url && !loading) {
      fetchDataAndUpdateFormik();
    }
  });

  // Router instance
  const router = useRouter();

  const { set: setRecipe, delete: deleteRecipe } = recipeActions;

  const initialValues = useMemo(() => {
    return {
      owner: auth.user ? (auth.user as { id: string }).id : '',
      ...recipe,
    };
  }, [recipe, auth.user]);

  // Get fields and suggestions
  const fields = RECIPE_FIELDS;
  const keywordSuggestions = useMemo(() => recipes && getKeywordSuggestions(recipes), [recipes]);
  const cuisineSuggestions = useMemo(() => recipes && getCuisineSuggestions(recipes), [recipes]);

  // Get formik instance ref
  const formik = useCustomFormik({
    initialValues,
    validationSchema: recipeYupSchema,
    enableReinitialize: true,
    onSubmit: async (values: Recipe) => {
      const filesToUpload = formik.values.images.filter((url) => url.startsWith('blob:'));
      if (filesToUpload.length > 0) {
        const storageClass = new FirebaseStorageProvider();
        for (const url of filesToUpload) {
          const file = await fetch(url).then((r) => r.blob());
          const filename = url.split('/').pop();
          const imageUrl = await storageClass.uploadFile(
            file,
            `uploads/recipes/${recipeId}/${filename}`
          );
          // Replace blob url in images with real url
          await formik.setFieldValue('images', [
            ...formik.values.images.filter((img) => img !== url),
            imageUrl,
          ]);
          //formik.setFieldValue('images', [...formik.values.images, imageUrl]);
        }
      }
      // Save
      await setRecipe(values, recipeId);
      // Redirect to recipe page
      if (!recipe) {
        router.push(`/app/recipes/${recipeId}`);
      }
      //onClose();
    },
  });

  useEffect(() => {
    console.log('FORMIK', formik);
  }, [formik.values]);

  // Fetch recipe data from api
  const {
    data: externalRecipeData,
    loading,
    error: fetchUrlError,
    fetchData,
  } = useFetch<ExternalRecipe>(
    `https://api-python.appelent.site/recipes/scrape?url=${formik?.values.url}`,
    {
      autoFetch: false,
    }
  );

  useEffect(() => {
    if (externalRecipeData) {
      if (externalRecipeData && externalRecipeData.status === 'success') {
        formik.setValues({
          ...formik.values,
          ...parseExternalRecipeData(externalRecipeData.data),
        });
      }
      //formik.handleSubmit();
    }
  }, [externalRecipeData]); //TODO: just a normal fetch function and error in state

  useEffect(() => {
    // Temp to fix yields
    if (typeof formik?.values?.yields === 'string') {
      formik.setFieldValue('yields', undefined);
    }
  }, [formik?.values?.yields]);

  // Conditions for disabling submit button
  const disableSubmit =
    formik?.isSubmitting || loading || !formik?.isValid || !formik?.dirty || formik?.isValidating;

  return (
    <>
      {' '}
      {fields && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="md"
          fullWidth
          fullScreen={fullScreen}
        >
          <CustomForm
            formik={formik}
            options={{
              editMode: true,
              debounce: 300,
              muiTextFieldProps: {
                fullWidth: true,
                variant: 'outlined',
                multiline: true,
              },
              muiRatingProps: {
                size: 'large',
              },
            }}
          >
            <DialogTitle
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                {recipe ? 'Edit Recipe' : 'Add Recipe'}
                <IconButton
                  onClick={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                  }}
                  disabled={disableSubmit}
                  style={{ marginLeft: '8px' }}
                >
                  {<SaveIcon />}
                </IconButton>
              </div>

              <IconButton
                onClick={onClose} // Add your close handler here
                style={{ marginLeft: 'auto' }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              {formik?.values?.image && (
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
              <TextField field={fields.name} />
              <Rating field={fields.score} />
              <Grid
                container
                spacing={2}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Grid
                  item
                  xs={12}
                  sm={formik?.values.url ? 8 : 12}
                >
                  <Box>
                    {/* TODO: If url is invalid, save continues */}
                    <TextField field={fields.url} />
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}
                >
                  {formik?.values?.url && (
                    <Box>
                      <LoadingButton
                        variant="contained"
                        isLoading={loading}
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
              {fetchUrlError && (
                <Typography
                  color="error"
                  gutterBottom
                >
                  {fetchUrlError}
                </Typography>
              )}

              <AutocompleteChipList
                field={fields.cuisine}
                suggestions={cuisineSuggestions}
              />
              <List field={fields.ingredients} />
              <List field={fields.instructions} />

              <TextField field={fields.comments} />
              <GridLayout
                items={[
                  <TextField field={fields.prepTime} />,
                  <TextField field={fields.cookTime} />,
                  <TextField field={fields.totalTime} />,
                ]}
              />
              <TextField field={fields.category} />
              <AutocompleteChipList
                field={fields.keywords}
                suggestions={keywordSuggestions}
              />
              <TextField field={fields.yieldsText} />
              <TextField field={fields.calories} />
              <Images
                field={fields.images}
                uploadImage={async (file) => {
                  console.log(file);
                  const storageClass = new FirebaseStorageProvider();
                  const url = await storageClass.uploadFile(
                    file,
                    `uploads/recipes/${recipeId}/${file.name}`
                  );
                  return url;
                }}
                deleteImage={async (url) => {
                  const storageClass = new FirebaseStorageProvider();
                  await storageClass.deleteFile(url);
                }}
                getFavorite={(url) => {
                  return formik.values.image === url;
                }}
                setFavorite={(url) => {
                  formik.setFieldValue('image', url);
                }}
              />
              {/* {recipe ? (
                <ImageUploader
                  originalFileName={`/uploads/recipes/${recipe?.id || createGuid()}/${uploadFileName}.jpg`}
                  uploadFile={async (file, filename) => {
                    // Save the original file to storage
                    const storageClass = new FirebaseStorageProvider({} as any, { instance: {} });
                    const originalFileUrl = await storageClass.uploadFile(file, filename);
                    formik.setFieldValue('image', originalFileUrl);
                    const currentImages = formik.values.images || [];
                    formik.setFieldValue('images', [...currentImages, originalFileUrl]);
                    return originalFileUrl;
                  }}
                  //multiple={true}
                  // crop={{
                  //   path: `/uploads/recipes/${recipe?.id || createGuid()}/${uploadFileName}-cropped.jpg`,
                  //   uploadFile: async (file, filename) => {
                  //     // Save the original file to storage
                  //     const storageClass = new FirebaseStorageProvider({} as any, { instance: {} });
                  //     const originalFileUrl = await storageClass.uploadFile(file, filename);
                  //     // update state with the type url
                  //     formik.setFieldValue('image', originalFileUrl);
                  //     return originalFileUrl;
                  //   },
                  //   props: { aspect: 16 / 9 },
                  // }}
                  // TODO: fix crop
                />
              ) : (
                <Box>Note: After saving the recipe, pictures can be uploaded</Box>
              )} */}
              {getLogLevel() === 'debug' && (
                <JsonEditor
                  data={{ recipe, formik: formik?.values }}
                  options={{ collapsed: true }}
                />
              )}
            </DialogContent>
            <DialogActions>
              <CancelButton onClick={onClose}>Cancel</CancelButton>
              {/* <Button
                onClick={() => {
                  formik.resetForm();
                  onClose();
                }}
                color="secondary"
              >
                Cancel
              </Button> */}
              <SubmitButton>Save</SubmitButton>
              <SubmitButton onClick={onClose}>Save and close</SubmitButton>
              {/* <Button
                type="submit"
                color="primary"
              >
                Save
              </Button> */}
              {!recipe && (
                <Button
                  onClick={() => {
                    deleteRecipe(recipe.id);
                    formik.resetForm();
                    onClose();
                  }}
                  color="error"
                >
                  Delete
                </Button>
              )}
            </DialogActions>
          </CustomForm>
        </Dialog>
      )}
    </>
  );
};

export default RecipeEditDialog;
