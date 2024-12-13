import BeltCard from '@/components/satisfactory/cards/belt-card';
import Belt from '@/libs/satisfactory/data/belt';
import satisfactoryData from '@/libs/satisfactory/data/satisfactory-data';
import { Grid } from '@mui/material';
import DefaultPage from '../../default/DefaultPage';

const Belts = () => {
  // const { data: filteredItems } = useFilter(data.belts, {
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
          placeholder={`Search belts`}
        />
      </Stack> */}
      <Grid
        container
        spacing={3}
      >
        {satisfactoryData.belts.map((item: Belt) => {
          return (
            <Grid
              item
              key={item.className}
              xs={6}
              sm={3}
              md={3}
            >
              <BeltCard item={item} />
            </Grid>
          );
        })}
      </Grid>
      {/* <Box sx={{ mt: 2 }}>
        <Pagination
          count={filterOptions.pages || 0}
          page={filteredItems?.length > 0 ? filterOptions.page - 1 : 0}
          onChange={(e, newPage) => filterOptions.setPage(newPage - 1)}
        />
      </Box> */}
    </DefaultPage>
  );
};

export default Belts;
