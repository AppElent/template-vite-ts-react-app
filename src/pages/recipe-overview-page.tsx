import { useData } from '@/libs/data-sources';
import DefaultPaperbasePage from '@/pages/default/DefaultPaperbasePage';
import RecipeOverview from '@/sections/recipe-overview-page/recipe-overview';

const RecipeOverviewPage = () => {
  const {
    data,
    add: addRecipe,
    delete: deleteRecipe,
    update: updateRecipe,
    set: setRecipe,
  } = useData('recipes');

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
        setRecipe={setRecipe}
      />
    </DefaultPaperbasePage>
  );
};

export default RecipeOverviewPage;
