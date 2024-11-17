import CustomBreadcrumbs from '@/components/default/custom-breadcrumbs';
import { useData } from '@/libs/data-sources';
import DefaultPaperbasePage from '@/pages/default/DefaultPaperbasePage';
import RecipeOverview from '@/sections/recipe-overview-page/recipe-overview';

const RecipeOverviewPage = () => {
  const { data } = useData('recipes');

  return (
    <DefaultPaperbasePage title="Recipes">
      {/* <Box sx={{ flexGrow: 1 }}>
        <Paper sx={{ margin: 'auto', overflow: 'hidden', py: 2, px: 2 }}></Paper>
      </Box> */}
      <CustomBreadcrumbs />
      <RecipeOverview recipes={data || []} />
    </DefaultPaperbasePage>
  );
};

export default RecipeOverviewPage;
