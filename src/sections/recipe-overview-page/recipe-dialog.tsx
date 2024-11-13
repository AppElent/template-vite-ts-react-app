// @ts-nocheck

import ImageUploader from '@/components/default/image-uploader';
import JsonEditor from '@/components/default/json-editor';
import LoadingButton from '@/components/default/loading-button';
import useFetch from '@/hooks/use-fetch';
import { useAuth } from '@/libs/auth';
import CustomField from '@/libs/forms/custom-field';
import CustomForm from '@/libs/forms/custom-form';
import useCustomFormik from '@/libs/forms/use-custom-formik';
import getRecipeFields from '@/libs/recipes/get-recipe-fields';
import parseExternalRecipeData from '@/libs/recipes/parse-external-recipe-data';
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
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { StringParam, useQueryParam } from 'use-query-params';
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

  const initialValues = useMemo(() => {
    return {
      owner: auth.user.id,
      ...recipe,
    };
  }, [recipe, auth.user.id]);

  const fields = useMemo(() => getRecipeFields(recipes), [recipes]);

  // Get formik instance ref
  const formik = useCustomFormik({
    initialValues,
    validationSchema: recipeYupSchema,
    enableReinitialize: true,
    onSubmit: async (values: Recipe) => {
      const savedRecipe = await setRecipe(values, recipe?.id);
      if (recipeId === 'new') {
        setRecipeId(savedRecipe.id);
      }
      setIsEditing(false);
    },
    fields,
  });

  console.log('FORMIK', formik);

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
  const [urlParam, setUrlParam] = useQueryParam('url', StringParam);
  useEffect(() => {
    const fetchDataAndUpdateFormik = async () => {
      await formik.setFieldValue('url', urlParam);
      await fetchData(`https://api-python.appelent.site/recipes/scrape?url=${urlParam}`);
      setUrlParam(undefined, 'replaceIn');
    };
    if (urlParam && formik.values.url !== urlParam && !loading) {
      fetchDataAndUpdateFormik();
    }
  }, [urlParam, formik?.values?.url, fetchData, setUrlParam, loading]);

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
  }, [externalRecipeData]);

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
            editMode: isEditing,
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
            <CustomField field={fields.name} />
            <CustomField field={fields.description} />
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
                  <CustomField field={fields.url} />
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

            <CustomField field={fields.cuisine} />
            <CustomField field={fields.ingredients} />
            <CustomField field={fields.instructions} />
            <CustomField field={fields.score} />
            <CustomField field={fields.comments} />
            <Grid
              container
              spacing={1}
            >
              <Grid
                item
                xs={4}
              >
                <CustomField field={fields.prepTime} />
              </Grid>
              <Grid
                item
                xs={4}
              >
                <CustomField field={fields.cookTime} />
              </Grid>
              <Grid
                item
                xs={4}
              >
                <CustomField field={fields.totalTime} />
              </Grid>
            </Grid>

            <CustomField field={fields.category} />
            <CustomField field={fields.keywords} />
            <CustomField field={fields.yieldsText} />
            <CustomField field={fields.calories} />
            {formik?.values?.images && formik?.values?.images?.length > 0 && (
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
            <JsonEditor
              data={{ recipe, formik: formik?.values }}
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
        </CustomForm>
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
    </>
  );
}

export default RecipeDialog;
