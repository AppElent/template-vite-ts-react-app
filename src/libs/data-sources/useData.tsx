import { useContext, useEffect, useMemo } from 'react';
import { DataSourceSource } from '.';
import { DataContext } from './DataProvider';

const useData = (key: string, options = {}, newDataSource?: DataSourceSource) => {
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
    if (
      dataSource &&
      dataSource.options?.subscribe &&
      typeof dataSource?.subscribe === 'function' &&
      !subscriptions[key]
    ) {
      subscribeToData(key);
    }
  }, [key, dataSource, subscribeToData, subscriptions, context.dataSources]);

  useEffect(() => {
    if (newDataSource && !context.dataSources.find((ds) => ds.key === key)) {
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
    update: (data: any, id: string) => update(key, data, id),
    set: (data: any, id: string) => set(key, data, id),
    delete: (id: string) => remove(key, id),
    dataSource,
    addDataSource,
    setDataSource,
    dataSources: context.dataSources,
  };
};

export default useData;
