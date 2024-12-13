import ItemCard from '@/components/satisfactory/cards/item-card';
import BaseItem from '@/libs/satisfactory/data/base-item';
import satisfactoryData from '@/libs/satisfactory/data/satisfactory-data';
import { Grid } from '@mui/material';
import _ from 'lodash';
import DefaultPage from '../../default/DefaultPage';

const Buildings = () => {
  // const { data: filteredItems, ...filterOptions } = useFilter(data.buildings, {
  //   initialSortField: 'name',
  //   initialSortDirection: 'asc',
  //   initialRowsPerPage: 24,
  //   // initialPage: 0,
  //   updateInitialData: true,
  //   searchableFields: ['name'],
  //   debounceTime: 100,
  // });

  return (
    <DefaultPage>
      {/* <Stack
        spacing={2}
        mb={2}
      >
        <SearchBar
          onClear={() => filterOptions.setSearchQuery('')}
          value={filterOptions.inputQuery}
          onChange={(e) => filterOptions.setSearchQuery(e.target.value)}
          placeholder={`Search buildings`}
        />
      </Stack> */}
      <Grid
        container
        spacing={3}
      >
        {_.sortBy(satisfactoryData.buildings, 'name').map((item: BaseItem) => {
          return (
            <Grid
              item
              key={item.className}
              xs={6}
              sm={2}
              md={2}
            >
              <ItemCard item={item} />
            </Grid>
          );
        })}
      </Grid>
      {/* <Box sx={{ mt: 2 }}>
        <Pagination
          count={filterOptions.pages || 0}
          page={filteredItems?.length > 0 ? filterOptions.page - 1 : 0}
          onChange={(_e, newPage) => filterOptions.setPage(newPage - 1)}
        />
      </Box> */}
    </DefaultPage>
  );
};

export default Buildings;
