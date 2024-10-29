import { useContext, useEffect, useMemo } from 'react';
import { DataContext } from './DataProvider';

const useData = (key: string, options = {}, newDataSource: any) => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }

  // // If datasource key cannot be found
  // if (!context.dataSources.find((ds) => ds.key === key)) {
  //   console.log(newDataSource, !newDataSource)
  //   if(newDataSource){
  //     console.log('Adding new data source', newDataSource)
  //     context.addDataSource({key, dataSource: newDataSource});
  //   }else{
  //     throw new Error(`Data source with key "${key}" not found`);
  //   }
    
  // }

  //const { shouldSubscribe = true } = options;
  const dataSource = useMemo(
    () => context.dataSources.find((ds) => ds.key === key)?.dataSource,
    [key, context]
  );

  const { subscribeToData, subscriptions, data, loading, error, add, update, remove, addDataSource, setDataSource } = context;

  useEffect(() => {
    if (dataSource && typeof dataSource?.subscribe === 'function' && !subscriptions[key]) {
      subscribeToData(key);
    }
    // else {
    //   fetchData(key);
    // }
  }, [key, dataSource, subscribeToData, subscriptions, context.dataSources]);

  useEffect(() => {
    if (newDataSource && !context.dataSources.find((ds) => ds.key === key) ){
      console.log(newDataSource, context.dataSources.find((ds) => ds.key === key))
      addDataSource({key, dataSource: newDataSource});
    }
  }, [newDataSource, key, addDataSource, context.dataSources]);

  return {
    data: data[key],
    loading: loading[key],
    error: error[key],
    fetchData: (filter) => context.fetchData(key, filter),
    get: (id) => dataSource.get(id),
    getAll: (filter) => dataSource.getAll(filter),
    add: (item) => add(key, item),
    update: (id, data) => update(key, id, data),
    delete: (id) => remove(key, id),
    dataSource,
    addDataSource,
    setDataSource,
  };
};

export default useData;
