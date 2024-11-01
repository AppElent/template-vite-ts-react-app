import Recipe from '@/types/recipe';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const RecipeOverviewListView = ({
  recipes,
  handleRecipeClick,
}: {
  recipes: Recipe[];
  handleRecipeClick: (recipe: Recipe) => void;
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Recipe Name</TableCell>
            <TableCell>Cooking Time</TableCell>
            <TableCell>Ingredients</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recipes.map((recipe: Recipe) => (
            <TableRow
              key={recipe.id}
              onClick={() => handleRecipeClick(recipe)}
            >
              <TableCell>
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  width="80"
                  style={{ borderRadius: '8px' }}
                />
              </TableCell>
              <TableCell>{recipe.name}</TableCell>
              <TableCell>{recipe.cookingTime} mins</TableCell>
              <TableCell>{recipe.ingredients?.join(', ')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecipeOverviewListView;
