import SearchBar from '@/components/default/ui/search-bar';
import ProductCard from '@/components/satisfactory/cards/product-card';
import useFilter from '@/hooks/use-filter';
import Product from '@/libs/satisfactory/data/product';
import satisfactoryData from '@/libs/satisfactory/data/satisfactory-data';
import { Box, Grid, Pagination, Stack } from '@mui/material';
import DefaultPage from '../../default/DefaultPage';

const Products = () => {
  const { data: filteredItems, ...filterOptions } = useFilter(satisfactoryData.products, {
    initialSortField: 'name',
    initialSortDirection: 'asc',
    initialRowsPerPage: 24,
    // initialPage: 0,
    updateInitialData: true,
    searchableFields: ['name', 'description', 'products', 'ingredients'],
    debounceTime: 100,
  });

  return (
    <DefaultPage>
      <Stack
        spacing={2}
        mb={2}
      >
        <SearchBar
          onClear={() => filterOptions.setSearchQuery('')}
          value={filterOptions.inputQuery}
          onChange={(e) => filterOptions.setSearchQuery(e.target.value)}
          placeholder={`Search products`}
        />
      </Stack>
      <Grid
        container
        spacing={3}
      >
        {filteredItems.map((product: Product) => (
          <Grid
            item
            key={product.className}
            xs={6}
            sm={2}
            md={2}
          >
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 2 }}>
        <Pagination
          count={filterOptions.pages || 0}
          page={filteredItems?.length > 0 ? filterOptions.page - 1 : 0}
          onChange={(_e, newPage) => filterOptions.setPage(newPage - 1)}
        />
      </Box>
    </DefaultPage>
  );
};

export default Products;
