import useDialog from '@/hooks/use-dialog';
import Recipe from '@/types/recipe';
import {
  AccessTime as AccessTimeIcon,
  Edit as EditIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Rating,
  Typography,
} from '@mui/material';
import RecipeEditDialog from '../../sections/recipes/recipe-edit-dialog';
import NoImageAvailable from '../default/images/no-image-available';
import ImageList from '../default/ui/image-list';

// Sample recipe object (same as before)
const sampleRecipe = {
  name: 'Delicious Pasta',
  description: 'A quick and easy pasta dish perfect for weeknight dinners.',
  time: { prep: 10, cooking: 20, total: 30 },
  yields: { quantity: 4, unit: 'servings' },
  nutrients: {
    calories: '400',
    fat: '10g',
    sugar: '2g',
    fiber: '3g',
    protein: '15g',
    carbs: '65g',
  },
  image: '/placeholder.svg?height=400&width=600',
  ingredients: [
    '300g spaghetti',
    '2 cloves of garlic, minced',
    '1/4 cup olive oil',
    'Salt and pepper to taste',
  ],
  instructions: [
    'Boil the spaghetti according to package instructions.',
    'In a pan, heat olive oil and sauté minced garlic until fragrant.',
    'Drain the pasta and add it to the pan with garlic oil.',
    'Season with salt and pepper, toss well, and serve hot.',
  ],
  category: 'Main Course',
  keywords: ['pasta', 'quick', 'easy', 'Italian'],
  cuisine: ['Italian'],
  createdAt: '2023-05-01T12:00:00Z',
  updatedAt: '2023-05-15T14:30:00Z',
};

// Custom theme (same as before)
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#FF8585',
//       light: '#FFA5A5',
//       dark: '#FF6B6B',
//       contrastText: '#fff',
//     },
//     secondary: {
//       main: '#4CAF50',
//       light: '#81C784',
//       dark: '#388E3C',
//       contrastText: '#fff',
//     },
//     text: {
//       primary: '#333333',
//       secondary: '#666666',
//     },
//     background: {
//       default: '#FFFFFF',
//       paper: '#FFFFFF',
//     },
//   },
//   typography: {
//     h4: {
//       fontWeight: 700,
//       color: '#333333',
//     },
//     h6: {
//       fontWeight: 600,
//       color: '#333333',
//     },
//   },
//   components: {
//     MuiChip: {
//       styleOverrides: {
//         root: {
//           borderRadius: '8px',
//         },
//         outlined: {
//           borderColor: '#FF8585',
//           color: '#FF8585',
//           '&:hover': {
//             backgroundColor: 'rgba(255, 133, 133, 0.04)',
//           },
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           borderRadius: '12px',
//           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
//         },
//       },
//     },
//   },
// });

// TODO: add image viewer and set image as default

const RecipeDetails = ({ recipe = sampleRecipe }: { recipe?: Recipe }) => {
  const dialog = useDialog();

  const handleEdit = () => {
    dialog.open();
  };

  return (
    <Paper
      elevation={3}
      sx={{ overflow: 'hidden' }}
    >
      <RecipeEditDialog
        open={dialog.isOpen}
        recipe={recipe}
        onClose={() => dialog.close()}
      />
      {recipe.image ? (
        <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
          <Box
            component="img"
            src={recipe.image || '/placeholder.svg?height=400&width=600'}
            alt={recipe.name}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
      ) : (
        <NoImageAvailable />
      )}

      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography
            variant="h4"
            component="h1"
          >
            {recipe.name}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit
          </Button>
        </Box>
        {recipe.description && (
          <Typography
            variant="body1"
            paragraph
            color="text.secondary"
            sx={{ fontSize: '1.1rem' }}
          >
            {recipe.description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
          {!!recipe.score && (
            <Rating
              value={recipe.score || 0}
              readOnly
              precision={0.5}
            />
          )}
          {recipe.time && (
            <>
              {!!recipe.time.prep && (
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`Prep: ${recipe.time.prep} min`}
                  variant="outlined"
                  sx={{ bgcolor: 'background.paper' }}
                />
              )}
              {!!recipe.time.cooking && (
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`Cook: ${recipe.time.cooking} min`}
                  variant="outlined"
                  sx={{ bgcolor: 'background.paper' }}
                />
              )}
              {!!recipe.time.total && (
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`Total: ${recipe.time.total} min`}
                  variant="outlined"
                  sx={{ bgcolor: 'background.paper' }}
                />
              )}
            </>
          )}
          {recipe.yieldsText && (
            <Chip
              icon={<RestaurantIcon />}
              label={`${recipe.yieldsText}`}
              variant="outlined"
              sx={{ bgcolor: 'background.paper' }}
            />
          )}
        </Box>
        <Grid
          container
          spacing={4}
        >
          <Grid
            item
            xs={12}
            md={8}
          >
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <Paper
                elevation={1}
                sx={{ p: 3, mb: 3 }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  color="primary"
                >
                  Ingredients
                </Typography>
                <List>
                  {recipe.ingredients.map((ingredient, index) => (
                    <ListItem
                      key={index}
                      disablePadding
                      sx={{ py: 1 }}
                    >
                      <ListItemText
                        primary={ingredient}
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: 'text.primary',
                            fontSize: '1.1rem',
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
            {recipe.instructions && recipe.instructions.length > 0 && (
              <Paper
                elevation={1}
                sx={{ p: 3 }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  color="primary"
                >
                  Instructions
                </Typography>
                <List>
                  {recipe.instructions.map((instruction, index) => (
                    <ListItem
                      key={index}
                      alignItems="flex-start"
                      sx={{ py: 2 }}
                    >
                      <ListItemText
                        primary={`Step ${index + 1}`}
                        secondary={instruction}
                        primaryTypographyProps={{
                          color: 'primary',
                          fontWeight: 600,
                          gutterBottom: true,
                        }}
                        secondaryTypographyProps={{
                          color: 'text.primary',
                          fontSize: '1.1rem',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
          >
            {recipe.nutrients && Object.keys(recipe.nutrients).length > 0 && (
              <Paper
                elevation={1}
                sx={{ p: 3, mb: 3 }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  color="primary"
                >
                  Nutritional Information
                </Typography>
                <List dense>
                  {Object.entries(recipe.nutrients).map(([key, value]) => (
                    <ListItem
                      key={key}
                      disablePadding
                      sx={{ py: 1 }}
                    >
                      <ListItemText
                        primary={`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`}
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: 'text.primary',
                            fontSize: '1rem',
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}

            <Paper
              elevation={1}
              sx={{ p: 3, mb: 3 }}
            >
              {recipe.category && (
                <>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    color="primary"
                    fontWeight="600"
                  >
                    Category
                  </Typography>
                  <Chip
                    label={recipe.category}
                    sx={{
                      mb: 3,
                      bgcolor: 'secondary.main',
                      color: 'secondary.contrastText',
                    }}
                  />
                </>
              )}
              {recipe.cuisine && recipe.cuisine.length > 0 && (
                <>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    color="primary"
                    fontWeight="600"
                  >
                    Cuisine
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {recipe.cuisine.map((item) => (
                      <Chip
                        key={item}
                        label={item}
                        size="small"
                        sx={{
                          bgcolor: 'secondary.light',
                          color: 'secondary.contrastText',
                        }}
                      />
                    ))}
                  </Box>
                </>
              )}
              {recipe.keywords && recipe.keywords.length > 0 && (
                <>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    color="primary"
                    fontWeight="600"
                  >
                    Keywords
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {recipe.keywords.map((keyword) => (
                      <Chip
                        key={keyword}
                        label={keyword}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: 'primary.main', color: 'primary.main' }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Paper>

            <Box sx={{ px: 1 }}>
              {recipe.createdAt && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Created: {new Date(recipe.createdAt).toLocaleDateString()}
                </Typography>
              )}
              {recipe.updatedAt && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Last updated: {new Date(recipe.updatedAt).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
        <Paper>
          <Box sx={{ maxWidth: '350px', overflow: 'hidden' }}>
            <ImageList
              images={recipe.images || []}
              onClick={() => {}}
            />
          </Box>
        </Paper>
      </Box>
    </Paper>
  );
};

export default RecipeDetails;
