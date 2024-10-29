import DefaultPaperbasePage from '@/pages/default/DefaultPaperbasePage';
import RecipeOverview from '@/sections/recipe-overview-page/recipe-overview';
import { useData } from '@/libs/data-sources';

const RecipeOverviewPage = () => {
  const { data, add: addRecipe, delete: deleteRecipe, update: updateRecipe } = useData('recipes');
  console.log(data);
  return (
    <DefaultPaperbasePage title="Recipes">
      {/* <Box sx={{ flexGrow: 1 }}>
        <Paper sx={{ margin: 'auto', overflow: 'hidden', py: 2, px: 2 }}></Paper>
      </Box> */}
      <RecipeOverview
        recipes={data || []}
        addRecipe={addRecipe}
        deleteRecipe={deleteRecipe}
        updateRecipe={updateRecipe}
      />
    </DefaultPaperbasePage>
  );
};

export default RecipeOverviewPage;
