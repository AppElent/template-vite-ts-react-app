// @ts-nocheck

import AutocompleteChipList from '@/components/default/forms/AutocompleteChipList';
import List from '@/components/default/forms/List';
import Rating from '@/components/default/forms/Rating';
import TextField from '@/components/default/forms/TextField';
import JsonEditor from '@/components/default/json-editor';
import GridLayout from '@/components/default/ui/grid-layout';
import RecipeImageList from '@/components/recipes/recipe-image-list';
import { getLogLevel } from '@/config';
import { RECIPE_FIELDS } from '@/data/recipe-data';
import useFetch from '@/hooks/use-fetch';
import useQueryParamAction from '@/hooks/use-query-param-action';
import useRouter from '@/hooks/use-router';
import { useAuth } from '@/libs/auth';
import { useData } from '@/libs/data-sources';
import { CustomForm } from '@/libs/forms';
import useCustomFormik from '@/libs/forms/use-custom-formik';
import { getCuisineSuggestions, getKeywordSuggestions } from '@/libs/recipes/get-recipe-fields';
import parseExternalRecipeData from '@/libs/recipes/parse-external-recipe-data';
import FirebaseStorageProvider from '@/libs/storage-providers/providers/FirebaseStorageProvider';
import { recipeYupSchema } from '@/schemas/recipe';
import Recipe from '@/types/recipe';
import { createGuid } from '@/utils/create-guid';
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
import { useEffect, useMemo, useState } from 'react';
import ImageUploader from '../../components/default/images/image-uploader';
import ImageViewerDialog from '../../components/default/images/image-viewer-dialog';
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

  const { set: setRecipe, delete: deleteRecipe, add: addRecipe } = recipeActions;

  // Image section
  //const [, setImage] = useState(recipe?.image || null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadFileName] = useState<string | null>(createGuid());

  const initialValues = useMemo(() => {
    return {
      owner: auth.user ? (auth.user as { id: string }).id : '',
      ...recipe,
    };
  }, [recipe, auth.user]);

  // Get fields and suggestions
  // const fields = useMemo(() => recipes && getRecipeFields(recipes), [recipes]);
  const fields = RECIPE_FIELDS;
  const keywordSuggestions = useMemo(() => recipes && getKeywordSuggestions(recipes), [recipes]);
  const cuisineSuggestions = useMemo(() => recipes && getCuisineSuggestions(recipes), [recipes]);

  // Get formik instance ref
  const formik = useCustomFormik({
    initialValues,
    validationSchema: recipeYupSchema,
    enableReinitialize: true,
    onSubmit: async (values: Recipe) => {
      if (!recipe) {
        const newRecipe = (await addRecipe(values)) as Recipe;
        router.push(`/app/recipes/${newRecipe.id}`);
      } else {
        await setRecipe(values, recipe?.id);
      }
      onClose();
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
  } = useFetch<any>(`https://api-python.appelent.site/recipes/scrape?url=${formik?.values.url}`, {
    autoFetch: false,
  });

  //Receive URL from query params. If set, update formik state with the URL
  // const [urlParam, setUrlParam] = useQueryParam('url', StringParam);
  // useEffect(() => {
  //   const fetchDataAndUpdateFormik = async () => {
  //     await formik.setFieldValue('url', urlParam);
  //     await fetchData(`https://api-python.appelent.site/recipes/scrape?url=${urlParam}`);
  //     setUrlParam(undefined, 'replaceIn');
  //   };
  //   if (urlParam && formik.values.url !== urlParam && !loading) {
  //     fetchDataAndUpdateFormik();
  //   }
  // }, [urlParam, formik?.values?.url, fetchData, setUrlParam, loading]);

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
              {/* <CustomField field={fields.name} /> */}
              {/* <CustomField field={fields.score} /> */}
              <Rating field={fields.score} />
              {/* <CustomField field={fields.description} /> */}
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
              {fetchUrlError && (
                <Typography
                  color="error"
                  gutterBottom
                >
                  {fetchUrlError}
                </Typography>
              )}

              {/* <CustomField field={fields.cuisine} /> */}
              <AutocompleteChipList
                field={fields.cuisine}
                suggestions={cuisineSuggestions}
              />
              {/* <CustomField field={fields.ingredients} /> */}
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
              {/* <GridLayout
                items={[
                  <CustomField field={fields.prepTime} />,
                  <CustomField field={fields.cookTime} />,
                  <CustomField field={fields.totalTime} />,
                ]}
              />
              {/* <CustomField field={fields.prepTime} />
              <CustomField field={fields.cookTime} />
              <CustomField field={fields.totalTime} /> */}
              <TextField field={fields.category} />
              {/* <CustomField field={fields.keywords} /> */}
              <AutocompleteChipList
                field={fields.keywords}
                suggestions={keywordSuggestions}
              />
              <TextField field={fields.yieldsText} />
              <TextField field={fields.calories} />
              {formik?.values?.images && formik?.values?.images?.length > 0 && (
                <RecipeImageList
                  images={formik.values.images}
                  setSelectedImage={setSelectedImage}
                />
              )}
              {recipe ? (
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
              )}
              {getLogLevel() === 'debug' && (
                <JsonEditor
                  data={{ recipe, formik: formik?.values }}
                  options={{ collapsed: true }}
                />
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={onClose}
                color="secondary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
              >
                Save
              </Button>
              {!recipe && (
                <Button
                  onClick={() => {
                    if (recipe?.id) {
                      deleteRecipe(recipe.id);
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
          </CustomForm>
        </Dialog>
      )}
      {/* Full Image Dialog */}
      <ImageViewerDialog
        image={selectedImage || undefined}
        onClose={() => setSelectedImage(null)}
        actions={[
          {
            label: 'Set as main image',
            onClick: (src?: string) => {
              formik.setValues({ ...formik.values, image: src });
              setSelectedImage(null);
            },
          },
        ]}
      />
    </>
  );
};

export default RecipeEditDialog;
