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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import * as Yup from 'yup';
import useFormFields from '@/hooks/use-form-fields';
import Recipe from '@/types/recipe';

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
  const [isEditing, setIsEditing] = useState(!recipeData); // If no recipe data is provided, default to editing mode
  const [image, setImage] = useState(recipeData?.image || null);

  const defaultValues = {
    name: '',
    url: '',
    ingredients: [''],
    instructions: [''],
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
        console.log('Updated Recipe:', values);
        onSave(recipeData?.id, values);
        setIsEditing(false);
        onClose();
      },
    }
  );

  console.log(formik, formFields);

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
            {formFields['name']}
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
            {formFields['url']}
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
            {image && (
              <Box
                display="flex"
                justifyContent="center"
                mt={2}
              >
                <img
                  src={image}
                  alt="Recipe"
                  width="100%"
                  style={{ maxWidth: '200px', borderRadius: '8px' }}
                />
              </Box>
            )}
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
    </>
  );
}

export default RecipeDialog;
