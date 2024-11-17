import SearchBar from '@/components/default/ui/search-bar';
import RecipeEditDialog from '@/components/recipes/recipe-edit-dialog';
import useDialog from '@/hooks/use-dialog';
import useFilter from '@/hooks/use-filter';
import useRouter from '@/hooks/use-router';
import Recipe from '@/types/recipe';
import AddIcon from '@mui/icons-material/Add'; // Import AddIcon
import {
  Fab,
  FormControl,
  Grid,
  MenuItem,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useQueryParam } from 'use-query-params';
import RecipeOverviewGalleryView from './recipe-overview-gallery-view';
import RecipeOverviewListView from './recipe-overview-list-view';

function RecipeOverview({ recipes = [] }: { recipes: Recipe[] }) {
  const [view /*, setView*/] = useState('gallery');
  const dialog = useDialog({ queryKey: 'recipe' });
  const [urlParam] = useQueryParam('url');

  const router = useRouter();

  // For mobile, set no minWidth on sort options
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleAddRecipe = useCallback(() => {
    //dialog.setData(undefined); // Clear dialog data for new recipe
    dialog.open('new');
  }, [dialog]); // TODO: receive url in dialog and remove it from query params

  useEffect(() => {
    if (urlParam && !dialog.isOpen) {
      handleAddRecipe();
    }
  }, [handleAddRecipe, urlParam, dialog.isOpen]);

  const { data: filteredItems, ...filterOptions } = useFilter(recipes, {
    initialSortField: 'score',
    initialSortDirection: 'desc',
    initialRowsPerPage: 25,
    initialPage: 0,
    updateInitialData: true,
    //searchableFields: ['name'],
  });

  // const handleViewChange = (_event: any, nextView: any) => {
  //   if (nextView !== null) {
  //     setView(nextView);
  //   }
  // };

  const handleRecipeClick = (recipe: Recipe) => {
    //dialog.setData(recipe);
    //dialog.open(recipe.id);
    router.push(`/app/recipes/${recipe.id}`);
  };

  const handleSortChange = (event: any) => {
    filterOptions.setSortField(event.target.value.split('-')[0]);
    filterOptions.setSortDirection(event.target.value.split('-')[1]);
  };

  const fabStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 16,
    right: 16,
  };

  const sortOptions = [
    { value: 'name-asc', label: 'Name (Ascending)' },
    { value: 'createdAt-desc', label: 'Date added (Newest first)' },
    { value: 'updatedAt-desc', label: 'Date modified (Newest first)' },
    { value: 'score-desc', label: 'Rating (Highest first)' },
  ];

  return (
    <>
      {/* {dialog.data && (
        <RecipeDialog
          open={dialog.isOpen}
          onClose={() => dialog.close()}
          setRecipe={(data: any, id: string | undefined) => {
            if (id) {
              return setRecipe(data, id);
            } else {
              return addRecipe(data);
            }
            //dialog.close();
          }}
          updateRecipe={updateRecipe}
          deleteRecipe={deleteRecipe}
          recipes={recipes}
          recipeId={dialog.data}
          setRecipeId={dialog.setData}
        />
      )} */}
      <RecipeEditDialog
        open={dialog.isOpen}
        onClose={() => dialog.close()}
      />

      <Stack
        spacing={2}
        mb={2}
      >
        <SearchBar
          onClear={() => filterOptions.setSearchQuery('')}
          value={filterOptions.searchQuery}
          onChange={(e) => filterOptions.setSearchQuery(e.target.value)}
          placeholder={`Search recipes`}
        />

        {/* <TextField
          label="Max Cooking Time"
          variant="outlined"
          type="number"
          value={''}
          onChange={(e) => console.log(e.target.value)}
        />
        <TextField
          label="Category"
          variant="outlined"
          select
          value={''}
          onChange={(e) => console.log(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Italian">Italian</MenuItem>
          <MenuItem value="Indian">Indian</MenuItem>
          <MenuItem value="Chinese">Chinese</MenuItem>
          {/* Add more categories as needed */}
        {/* </TextField> */}
      </Stack>
      {/* Toggle button to switch between views */}
      {/* <Stack
        justifyContent={'space-between'}
        direction={'row'}
        alignItems={'center'}
        sx={{ mb: 1 }}
      > */}
      <Grid
        container
        spacing={2}
        justifyContent={'space-between'}
        sx={{ mb: 2 }}
      >
        {/* <Grid
          item
          xs={12}
          md={6}
        >
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view toggle"
            //style={{ marginBottom: '16px' }}
          >
            <ToggleButton
              value="gallery"
              aria-label="gallery view"
            >
              <ViewModuleIcon /> Gallery
            </ToggleButton>
            <ToggleButton
              value="list"
              aria-label="list view"
            >
              <ViewListIcon /> List
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid> */}
        <Grid item>
          <FormControl
            className="sort-options"
            sx={{ minWidth: isMobile ? undefined : 275 }}
          >
            <TextField
              id="sort-label"
              label="Sort By"
              select
              value={`${filterOptions.sortField}-${filterOptions.sortDirection}`}
              onChange={handleSortChange}
              margin="dense"
              size="small"
            >
              {sortOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
      </Grid>
      {/* <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label="view toggle"
          //style={{ marginBottom: '16px' }}
        >
          <ToggleButton
            value="gallery"
            aria-label="gallery view"
          >
            <ViewModuleIcon /> Gallery
          </ToggleButton>
          <ToggleButton
            value="list"
            aria-label="list view"
          >
            <ViewListIcon /> List
          </ToggleButton>
        </ToggleButtonGroup>
        <FormControl
          className="sort-options"
          sx={{ minWidth: isMobile ? undefined : 275 }}
        >
          <TextField
            id="sort-label"
            label="Sort By"
            select
            value={`${filterOptions.sortField}-${filterOptions.sortDirection}`}
            onChange={handleSortChange}
            margin="dense"
            size="small"
          >
            {sortOptions.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      </Stack> */}

      {/* Gallery View */}
      {view === 'gallery' && (
        <RecipeOverviewGalleryView
          recipes={filteredItems}
          handleRecipeClick={handleRecipeClick}
        />
      )}

      {/* List View */}
      {view === 'list' && (
        <RecipeOverviewListView
          recipes={filteredItems}
          handleRecipeClick={handleRecipeClick}
        />
      )}
      <Fab
        color="primary"
        aria-label="add"
        style={fabStyle}
        onClick={handleAddRecipe}
      >
        <AddIcon />
      </Fab>
    </>
  );
}

export default RecipeOverview;
