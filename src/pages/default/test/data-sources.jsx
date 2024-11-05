import { db } from '@/config/firebase';
import useTabs from '@/hooks/use-tabs';
import FirestoreDataSource from '@/libs/data-sources/data-sources/FirestoreDataSource';
import LocalStorageDataSource from '@/libs/data-sources/data-sources/LocalStorageDataSource';
import JsonViewer from '@andypf/json-viewer/dist/esm/react/JsonViewer';
import { Button, Card, CardActions, CardContent, CardHeader, Grid } from '@mui/material';
import useData from '../../../libs/data-sources/useData';
import DefaultPaperbasePage from '../DefaultPaperbasePage';

const datasources = {
  Firestore: {
    'Collection - Realtime': new FirestoreDataSource(
      { target: 'dummy', targetMode: 'collection', subscribe: true },
      { db }
    ),
    'Collection - Normal': new FirestoreDataSource(
      { target: 'dummy', targetMode: 'collection' },
      { db }
    ),
    'Document - Realtime': new FirestoreDataSource(
      { target: 'dummy/test', targetMode: 'document', subscribe: true },
      { db }
    ),
    'Document - Normal': new FirestoreDataSource(
      { target: 'dummy/test', targetMode: 'document' },
      { db }
    ),
  },
  LocalStorage: {
    Realtime: new LocalStorageDataSource({ target: 'dummy', subscribe: true }),
    Normal: new LocalStorageDataSource({ target: 'dummy' }),
  },
};

const DataSource = (props) => {
  const { datasourceName, dataSource: newDataSource } = props;
  const datasource = useData(datasourceName, {}, newDataSource);

  const handleAdd = async () => {
    const newItem = { name: 'New Item' };
    await datasource.add(newItem);
  };

  const handleGetAll = async () => {
    const items = await datasource.getAll();
  };

  return (
    <Card>
      <CardHeader title={`${datasourceName} `} />
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
  const tabsData = Object.keys(datasources).map((key) => {
    return { label: key, value: key };
  });
  const tabs = useTabs(tabsData);
  const dataSources = datasources[tabs.tab];

  return (
    <DefaultPaperbasePage
      title="Data sources"
      tabs={tabs}
    >
      <Grid
        container
        spacing={3}
      >
        {dataSources &&
          Object.keys(dataSources).map((datasourceName) => {
            return (
              <Grid
                item
                xs={12}
                md={6}
                key={datasourceName}
              >
                <DataSource
                  datasourceName={tabs.tab + ' - ' + datasourceName}
                  dataSource={datasources[tabs.tab][datasourceName]}
                />
              </Grid>
            );
          })}
        {/* <Grid
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
        <Grid
          item
          xs={12}
          md={6}
        >
          <DataSource datasourceName="localStorageDummy" />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
        >
          <DataSource datasourceName="localStorageDummy2" />
        </Grid> */}
      </Grid>
    </DefaultPaperbasePage>
  );
};

export default DataOperations;
