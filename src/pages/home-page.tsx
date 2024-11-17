import CustomBreadcrumbs from '@/components/default/custom-breadcrumbs';
import { useData } from '@/libs/data-sources';
import LatestRecipes from '@/sections/home/latest-recipes';
import RecipeCarroussel from '@/sections/home/recipe-carroussel';
import { Container } from '@mui/material';
// TODO: Fix and implement the horizontal scroll card list component

const HomePage = () => {
  const { data: recipes } = useData('recipes');
  return (
    <Container
      maxWidth="lg"
      sx={{ py: 4, bgcolor: '#F9F9F9', minHeight: '100vh' }}
    >
      <CustomBreadcrumbs />
      <RecipeCarroussel recipes={recipes || []} />
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
    </Container>
  );
};

export default HomePage;
