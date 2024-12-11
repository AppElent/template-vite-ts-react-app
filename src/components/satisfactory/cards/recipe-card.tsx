import Recipe from '@/libs/satisfactory/data/recipe';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  // const maxItemsToShow = 3;
  // const usedForItems = product.getUsedFor();
  // const itemsToShow = usedForItems.slice(0, maxItemsToShow);
  // const hasMoreItems = usedForItems.length > maxItemsToShow;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        //height="200"
        sx={{ aspectRatio: '1 / 1' }}
        image={recipe.getImage()}
        alt={recipe.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
        >
          {recipe.name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
