import RecipeOneliner from '@/components/satisfactory/recipe-oneliner';
import Recipe from '@/libs/satisfactory/data/recipe';
import { Box, Stack } from '@mui/material';

interface RecipeSelectorProps {
  recipes: Recipe[];
  selectedRecipes?: string[];
  setSelectedRecipes?: (selectedRecipes: string[]) => void;
}

const RecipeSelector = ({ recipes }: RecipeSelectorProps) => {
  return (
    <div>
      <h1>Recipe Selector</h1>

      {recipes.map((recipe) => (
        <Stack
          key={recipe.className}
          direction="row"
          justifyContent={'space-between'}
        >
          <Box>{recipe.name}</Box>
          <Box>
            <RecipeOneliner
              key={recipe.className}
              recipe={recipe}
            />
          </Box>
        </Stack>
      ))}
    </div>
  );
};

export default RecipeSelector;
