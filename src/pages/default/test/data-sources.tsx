import JsonEditor from '@/components/default/json-editor';
import { db } from '@/config/firebase';
import useTabs from '@/hooks/use-tabs';
import FirestoreDataSource from '@/libs/data-sources/data-sources/FirestoreDataSource';
import LocalStorageDataSource from '@/libs/data-sources/data-sources/LocalStorageDataSource';
import { Dummy, dummyYupSchema } from '@/schemas/dummy';
import { Button, Card, CardActions, CardContent, CardHeader, Grid } from '@mui/material';
import useData from '../../../libs/data-sources/useData';
import DefaultPaperbasePage from '../DefaultPaperbasePage';

const dummyObject = {
  name: 'John Doe',
  number: 42,
  date: '2023-10-01',
  boolean: true,
  array: ['item1', 'item2'],
  object: {
    key: 'value',
  },
};

const datasources = {
  Firestore: {
    'Collection - Realtime': new FirestoreDataSource(
      {
        target: 'dummy',
        targetMode: 'collection',
        subscribe: true,
        YupValidationSchema: dummyYupSchema,
      },
      { db }
    ),
    'Collection - Normal': new FirestoreDataSource(
      { target: 'dummy', targetMode: 'collection', YupValidationSchema: dummyYupSchema },
      { db }
    ),
    'Document - Realtime': new FirestoreDataSource(
      {
        target: 'dummy/01iQznR3TyhzhI5ct5cQ',
        targetMode: 'document',
        subscribe: true,
        YupValidationSchema: dummyYupSchema,
      },
      { db }
    ),
    'Document - Normal': new FirestoreDataSource(
      {
        target: 'dummy/01iQznR3TyhzhI5ct5cQ',
        targetMode: 'document',
        YupValidationSchema: dummyYupSchema,
      },
      { db }
    ),
    'Collection - With Filters': new FirestoreDataSource(
      {
        target: 'dummy',
        targetMode: 'collection',
        subscribe: true,
        YupValidationSchema: dummyYupSchema,
        targetFilter: {
          orderBy: [{ field: 'number', direction: 'desc' }],
          limit: 10,
          filters: [{ field: 'boolean', operator: '==', value: false }],
          pagination: { page: 1, pageSize: 5 },
        },
      },
      { db }
    ),
  },
  LocalStorage: {
    Realtime: new LocalStorageDataSource({
      target: 'dummy',
      subscribe: true,
      YupValidationSchema: dummyYupSchema,
    }),
    Normal: new LocalStorageDataSource({ target: 'dummy', YupValidationSchema: dummyYupSchema }),
  },
};

const DataSource = (props: any) => {
  const { datasourceName, dataSource: newDataSource } = props;
  const datasource = useData<Dummy>(datasourceName, {}, newDataSource);
  const handleAdd = async () => {
    const newItem = dummyObject;
    await datasource.add(newItem);
  };

  console.log(datasourceName, datasource);

  const handleGetAll = async () => {
    const items = await datasource?.getAll();
    console.log(items);
  };

  const handleGet = async () => {
    const item = await datasource?.get();
    console.log(item);
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
            <>
              <JsonEditor data={datasource.data} />
            </>
          )}
        </CardContent>
        <CardActions>
          {!datasource.dataSource?.options?.subscribe && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => datasource.fetchData()}
              >
                Fetch data dummy2
              </Button>
            </>
          )}
          {datasource.dataSource?.options?.targetMode === 'collection' && (
            <>
              <Button onClick={handleAdd}>Add Item</Button>
              <Button onClick={handleGetAll}>Get All Items</Button>
            </>
          )}
          {datasource.dataSource?.options?.targetMode !== 'collection' && (
            <>
              <Button onClick={handleGet}>Get item</Button>
            </>
          )}
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
  const dataSources: { [key: string]: FirestoreDataSource<any> | LocalStorageDataSource } =
    datasources[tabs.tab as keyof typeof datasources];

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
                  dataSource={dataSources[datasourceName]}
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
