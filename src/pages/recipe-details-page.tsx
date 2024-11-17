import CustomBreadcrumbs from '@/components/default/custom-breadcrumbs';
import RecipeDetails from '@/components/recipes/recipe-details';
import useParamItem from '@/hooks/use-param-item';
import { useData } from '@/libs/data-sources';
import Recipe from '@/types/recipe';
import { Container } from '@mui/material';

const RecipeDetailsPage = () => {
  const { data: recipes } = useData('recipes');
  const recipe = useParamItem<Recipe>({
    items: recipes || [],
  });
  //   console.log(recipes, recipe);
  //   const location = useLocation();
  //   const navigate = useNavigate();

  //   // Determine if we came from "My Recipes" or "Recipes"
  //   const isFromMyRecipes = location.state?.from === '/myrecipes';

  console.log(recipe);
  return (
    <Container
      maxWidth="lg"
      sx={{ py: 4, bgcolor: '#F9F9F9', minHeight: '100vh' }}
    >
      {/* <Breadcrumbs
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link
          component={RouterLink}
          to="/"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon
            sx={{ mr: 0.5 }}
            fontSize="inherit"
          />
          Home
        </Link>
        <Link
          component={RouterLink}
          to={isFromMyRecipes ? '/myrecipes' : '/recipes'}
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <BookIcon
            sx={{ mr: 0.5 }}
            fontSize="inherit"
          />
          {isFromMyRecipes ? 'My Recipes' : 'Recipes'}
        </Link>
        <Typography color="text.primary">{recipe?.name}</Typography>
      </Breadcrumbs> */}
      <CustomBreadcrumbs currentPage={recipe?.name} />
      <RecipeDetails recipe={recipe} />
    </Container>
  );
};

export default RecipeDetailsPage;
