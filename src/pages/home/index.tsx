import { useData } from '@/libs/data-sources';
import DefaultPage from '@/pages/default/DefaultPage';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LatestRecipes from './_components/latest-recipes';
import RecipeCarroussel from './_components/recipe-carroussel';
// TODO: Fix and implement the horizontal scroll card list component

const HomePage = () => {
  const { data: recipes } = useData('recipes');
  const { t } = useTranslation('foodhub');

  return (
    <DefaultPage>
      <RecipeCarroussel recipes={recipes || []} />
      <Typography
        align="center"
        variant="h6"
        component="h2"
        gutterBottom
      >
        {t('pages.home.description')}
      </Typography>
      <LatestRecipes recipes={recipes?.slice(-6).reverse() || []} />
      {/* <HorizontalScrollCardList>
        {recipes.map((recipe: Recipe) => {
          return (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
            />
          );
        })}
      </HorizontalScrollCardList> */}
    </DefaultPage>
  );
};

export default HomePage;
