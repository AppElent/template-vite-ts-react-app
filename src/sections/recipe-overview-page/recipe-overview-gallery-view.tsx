import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import Recipe from '@/types/recipe';

const RecipeOverviewGalleryView = ({
  recipes,
  handleRecipeClick,
}: {
  recipes: Recipe[];
  handleRecipeClick: (recipe: Recipe) => void;
}) => {
  return (
    <Grid
      container
      spacing={4}
    >
      {recipes.map((recipe: any) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          key={recipe.id}
          onClick={() => handleRecipeClick(recipe)}
        >
          <Card>
            {recipe.image ? (
              <CardMedia
                component="img"
                height="160"
                image={recipe.image}
                alt={recipe.name}
              />
            ) : (
              <div
                style={{
                  height: '160px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f0f0f0',
                  color: '#888',
                  fontSize: '14px',
                }}
              >
                No image available
              </div>
            )}
            <CardContent>
              <Typography
                variant="h6"
                component="div"
              >
                {recipe.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Cooking Time: {recipe.cookingTime} minutes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RecipeOverviewGalleryView;
