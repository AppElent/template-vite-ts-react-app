import { Button, Card, CardActions, CardContent, CardHeader, Grid } from '@mui/material';
import useData from '../../../libs/data-sources/useData';
import DefaultPaperbasePage from '../DefaultPaperbasePage';
import JsonViewer from '@andypf/json-viewer/dist/esm/react/JsonViewer';
import FirebaseDataSource from '@/libs/data-sources/data-sources/FirebaseDataSource';
import FirebaseDataSourceNoRealtime from '@/libs/data-sources/data-sources/FirebaseDataSourceNoRealtime';
import { db } from '@/config/firebase';

const datasources = {
  dummy: new FirebaseDataSource({ target: 'dummy', targetMode: 'collection' }, { db }),
  dummy2: new FirebaseDataSourceNoRealtime({ target: 'dummy', targetMode: 'collection' }, { db }),
};

const DataSource = (props) => {
  const { datasourceName } = props;
  const datasource = useData(datasourceName, {}, datasources[datasourceName]);

  console.log(datasource);

  const handleAdd = async () => {
    const newItem = { name: 'New Item' };
    await datasource.add(newItem);
  };

  const handleGetAll = async () => {
    const items = await datasource.getAll();
    console.log(items);
  };

  return (
    <Card>
      <CardHeader title={`Datasource: ${datasourceName} `} />
      <div>
        <CardContent>
          Provider: {datasource.dataSource?.provider}
          <br />
          Loading: {datasource.loading ? 'true' : 'false'}
          <br />
          Error: {datasource.error ? 'true' : 'false'}
          <br />
          Data:
          {datasource.data && (
            <JsonViewer
              data={JSON.stringify(datasource.data)}
              expanded={false}
            />
          )}
        </CardContent>
        <CardActions>
          <Button onClick={handleAdd}>Add Item</Button>
          <Button onClick={handleGetAll}>Get All Items</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => datasource.fetchData()}
          >
            Fetch data dummy2
          </Button>
        </CardActions>
      </div>
    </Card>
  );
};

const DataOperations = () => {
  return (
    <DefaultPaperbasePage title="Data sources">
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
          md={6}
        >
          <DataSource datasourceName="dummy2" />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
        >
          <DataSource datasourceName="dummy" />
        </Grid>
      </Grid>
    </DefaultPaperbasePage>
  );
};

export default DataOperations;
