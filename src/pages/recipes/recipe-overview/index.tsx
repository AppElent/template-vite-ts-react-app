import { useData } from '@/libs/data-sources';
import DefaultPage from '@/pages/default/DefaultPage';
import RecipeOverview from './_components/recipe-overview';

const RecipeOverviewPage = () => {
  const { data } = useData('recipes');

  return (
    <DefaultPage>
      <RecipeOverview recipes={data || []} />
      {/* //{' '}
      </DefaultPaperbasePage> */}
    </DefaultPage>
  );
};

export default RecipeOverviewPage;
