import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useFormik } from 'formik';

function RecipeDialog({ open, onClose, onSave, recipeData }) {
  const [isEditing, setIsEditing] = useState(!recipeData); // If no recipe data is provided, default to editing mode
  const [image, setImage] = useState(recipeData?.image || null);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (recipeData) {
      formik.setValues({
        name: recipeData.name || '',
        url: recipeData.url || '',
        ingredients: recipeData.ingredients || [''],
        instructions: recipeData.instructions || [''],
        score: recipeData.score || '',
        comments: recipeData.comments || '',
        cookingTime: recipeData.cookingTime || '',
      });
      setImage(recipeData.image || null);
    } else {
      formik.resetForm();
      setImage(null);
    }
  }, [recipeData]);

  const formik = useFormik({
    initialValues: {
      name: recipeData?.name || '',
      url: recipeData?.url || '',
      ingredients: recipeData?.ingredients || [''],
      instructions: recipeData?.instructions || [''],
      score: recipeData?.score || '',
      comments: recipeData?.comments || '',
      cookingTime: recipeData?.cookingTime || '',
    },
    onSubmit: (values) => {
      console.log('Updated Recipe:', values);
      onSave(recipeData?.id, values);
      setIsEditing(false);
      onClose();
    },
  });

  // Toggle between viewing and editing mode
  const toggleEditMode = () => setIsEditing(!isEditing);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  // Helper functions to manage ingredient and instruction arrays
  const addLine = (field) => {
    formik.setFieldValue(field, [...formik.values[field], '']);
  };

  const deleteLine = (field, index) => {
    const newLines = [...formik.values[field]];
    newLines.splice(index, 1);
    formik.setFieldValue(field, newLines);
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
            {isEditing ? (
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
            )}
            {isEditing ? (
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
            )}
            <Typography
              variant="h6"
              sx={{ mt: 2 }}
            >
              Ingredients
            </Typography>
            <List dense>
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
            </List>
            {isEditing && (
              <Button
                onClick={() => addLine('ingredients')}
                fullWidth
                variant="outlined"
                style={{ marginBottom: '10px' }}
              >
                Add Ingredient
              </Button>
            )}

            <Typography
              variant="h6"
              sx={{ mt: 2 }}
            >
              Instructions
            </Typography>
            <List dense>
              {formik.values.instructions.map((instruction, index) => (
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
            )}

            {isEditing ? (
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
            )}
            {isEditing ? (
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
            )}
            {isEditing ? (
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
            )}

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
