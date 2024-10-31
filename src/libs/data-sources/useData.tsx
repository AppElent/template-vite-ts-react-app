import { useContext, useEffect, useMemo } from 'react';
import { DataSourceContext, DataSourceSource } from '.';
import { DataContext } from './DataProvider';

const useData = (
  key: string,
  options = {},
  newDataSource?: DataSourceSource
): DataSourceContext => {
  if (key === 'false') console.log(options);
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }

  const dataSource = useMemo(
    () => context.dataSources.find((ds) => ds.key === key)?.dataSource,
    [key, context]
  );

  const {
    subscribeToData,
    subscriptions,
    data,
    loading,
    error,
    add,
    update,
    set,
    remove,
    addDataSource,
    setDataSource,
  } = context;

  useEffect(() => {
    if (dataSource && typeof dataSource?.subscribe === 'function' && !subscriptions[key]) {
      subscribeToData(key);
    }
  }, [key, dataSource, subscribeToData, subscriptions, context.dataSources]);

  useEffect(() => {
    if (newDataSource && !context.dataSources.find((ds) => ds.key === key)) {
      console.log(
        newDataSource,
        context.dataSources.find((ds) => ds.key === key)
      );
      addDataSource({ key, dataSource: newDataSource });
    }
  }, [newDataSource, key, addDataSource, context.dataSources]);

  return {
    data: data[key],
    loading: loading[key],
    error: error[key],
    fetchData: (filter: any) => context.fetchData(key, filter),
    get: (id?: string) => dataSource?.get(id),
    getAll: (filter: any) => dataSource?.getAll(filter),
    add: (item: any) => add(key, item),
    update: (id: string, data: any) => update(key, id, data),
    set: (id: string, data: any) => set(key, id, data),
    delete: (id: string) => remove(key, id),
    dataSource,
    addDataSource,
    setDataSource,
  };
};

export default useData;
