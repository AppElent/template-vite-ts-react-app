import { useData } from '@/libs/data-sources';
import DefaultPage from '@/pages/default/DefaultPage';
import Recipe from '@/types/recipe';
import RecipeOverview from './_components/recipe-overview';

const RecipeOverviewPage = () => {
  const { data } = useData<Recipe[]>('recipes');

  return (
    <DefaultPage>
      <RecipeOverview recipes={data || []} />
      {/* //{' '}
      </DefaultPaperbasePage> */}
    </DefaultPage>
  );
};

export default RecipeOverviewPage;
