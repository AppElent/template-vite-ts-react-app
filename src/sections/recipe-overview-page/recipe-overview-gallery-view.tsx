import NoImageAvailable from '@/components/default/no-image-available';
import Recipe from '@/types/recipe';
import { Card, CardContent, CardMedia, Grid, Rating, Typography } from '@mui/material';

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
          <Card sx={{ position: 'relative' }}>
            {recipe.image ? (
              <CardMedia
                component="img"
                height="160"
                image={recipe.image}
                alt={recipe.name}
              />
            ) : (
              <NoImageAvailable />
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
                {recipe.time?.cook && <>Cooking Time: {recipe.time.cook} minutes</>}
                <Rating
                  value={recipe.score || 0}
                  readOnly
                />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RecipeOverviewGalleryView;
