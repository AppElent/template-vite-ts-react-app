import useDialog from '@/hooks/use-dialog';
import useFilter from '@/hooks/use-filter';
import Recipe from '@/types/recipe';
import AddIcon from '@mui/icons-material/Add'; // Import AddIcon
import ClearIcon from '@mui/icons-material/Clear';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import {
  Fab,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useQueryParam } from 'use-query-params';
import RecipeDialog from './recipe-dialog';
import RecipeOverviewGalleryView from './recipe-overview-gallery-view';
import RecipeOverviewListView from './recipe-overview-list-view';

function RecipeOverview({
  recipes = [],
  addRecipe,
  updateRecipe,
  setRecipe,
  deleteRecipe,
}: {
  recipes: Recipe[];
  addRecipe: (item: Recipe) => Promise<any>;
  updateRecipe: (item: Partial<Recipe>, id: string) => Promise<any>;
  setRecipe: (item: Recipe, id: string) => Promise<any>;
  deleteRecipe: (id: string) => Promise<any>;
}) {
  const [view, setView] = useState('gallery');
  const dialog = useDialog({ queryKey: 'recipe' });
  const [urlParam] = useQueryParam('url');

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
    initialSortField: 'name',
    initialSortDirection: 'asc',
    initialRowsPerPage: 25,
    initialPage: 0,
    updateInitialData: true,
    //searchableFields: ['name'],
  });

  const handleViewChange = (_event: any, nextView: any) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    //dialog.setData(recipe);
    dialog.open(recipe.id);
  };

  const fabStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 16,
    right: 16,
  };

  return (
    <>
      {dialog.data && (
        <RecipeDialog
          open={dialog.isOpen}
          onClose={() => dialog.close()}
          setRecipe={(data: any, id: string | undefined) => {
            console.log(id, data);
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
      )}

      <Stack
        spacing={2}
        mb={2}
      >
        <OutlinedInput
          placeholder={`Search recipes`}
          // startAdornment={
          //   <InputAdornment position="start">
          //     <SvgIcon>{/* <SearchMdIcon /> */}</SvgIcon>
          //   </InputAdornment>
          // }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="clear"
                onClick={() => filterOptions.setSearchQuery('')}
                onMouseDown={(e) => e.preventDefault()}
                edge="end"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          }
          autoFocus
          value={filterOptions.searchQuery || ''}
          sx={{ flexGrow: 1 }}
          onChange={(e) => filterOptions.setSearchQuery(e.target.value)}
        />
        <TextField
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
        </TextField>
      </Stack>
      {/* Toggle button to switch between views */}
      <Stack
        justifyContent={'space-between'}
        direction={'row'}
      >
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label="view toggle"
          style={{ marginBottom: '16px' }}
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
      </Stack>

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

RecipeOverview.propTypes = {
  recipes: PropTypes.array.isRequired,
  addRecipe: PropTypes.func.isRequired,
  updateRecipe: PropTypes.func.isRequired,
  deleteRecipe: PropTypes.func.isRequired,
};

export default RecipeOverview;
