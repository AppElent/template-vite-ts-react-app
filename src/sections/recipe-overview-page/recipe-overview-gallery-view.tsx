import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';

const RecipeOverviewGalleryView = ({ recipes, handleRecipeClick }) => {
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
            <CardMedia
              component="img"
              height="160"
              image={recipe.image}
              alt={recipe.name}
            />
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
