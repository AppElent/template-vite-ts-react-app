import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Stack,
  TextField,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  SvgIcon,
  IconButton,
} from '@mui/material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddIcon from '@mui/icons-material/Add'; // Import AddIcon
import ClearIcon from '@mui/icons-material/Clear';
import PropTypes from 'prop-types';
import useDialog from '@/hooks/use-dialog';
import RecipeDialog from './recipe-dialog';
import RecipeOverviewGalleryView from './recipe-overview-gallery-view';
import RecipeOverviewListView from './recipe-overview-list-view';
import useFilter from '@/hooks/use-filter';

// const recipes = [
//   {
//     name: 'Spaghetti Carbonara',
//     cookingTime: 20,
//     image: 'https://example.com/spaghetti.jpg',
//     ingredients: ['Spaghetti', 'Eggs', 'Bacon', 'Parmesan'],
//     instructions: ['Cook spaghetti', 'fry bacon', 'mix eggs and cheese', 'combine all ingredients'],
//   },
//   {
//     name: 'Chicken Curry',
//     cookingTime: 40,
//     image: 'https://example.com/chickencurry.jpg',
//     ingredients: ['Chicken', 'Curry Paste', 'Coconut Milk', 'Vegetables'],
//     instructions: ['Fry chicken', 'add curry paste', 'add coconut milk', 'add vegetables'],
//   },
//   // Add more recipes as needed
// ];

function RecipeOverview({ recipes = [], addRecipe, updateRecipe, deleteRecipe }) {
  const [view, setView] = useState('gallery');
  const dialog = useDialog();

  const { data: filteredItems, ...filterOptions } = useFilter(recipes, {
    initialSortField: 'name',
    initialSortDirection: 'asc',
    initialRowsPerPage: 25,
    initialPage: 0,
    updateInitialData: true,
    //searchableFields: ['name'],
  });

  const handleViewChange = (event, nextView) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };

  const handleRecipeClick = (recipe) => {
    console.log(recipe);
    dialog.setData(recipe);
    dialog.open();
  };

  const handleAddRecipe = () => {
    dialog.setData(null); // Clear dialog data for new recipe
    dialog.open();
  };

  return (
    <>
      <RecipeDialog
        open={dialog.isOpen}
        onClose={() => dialog.close()}
        onSave={(id, data) => {
          if (id) {
            updateRecipe(id, data);
          } else {
            addRecipe(data);
          }
          dialog.close();
        }}
        recipeData={dialog.data}
      />
      <Stack
        spacing={2}
        mb={2}
      >
        <OutlinedInput
          placeholder={`Search recipes`}
          startAdornment={
            <InputAdornment position="start">
              <SvgIcon>{/* <SearchMdIcon /> */}</SvgIcon>
            </InputAdornment>
          }
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
        {/* <TextField
          label="Search"
          variant="outlined"
          value={''}
          onChange={(e) => console.log(e.target.value)}
        /> */}
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddRecipe}
          size="medium"
          style={{ alignSelf: 'center' }}
        >
          Add Recipe
        </Button>
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
