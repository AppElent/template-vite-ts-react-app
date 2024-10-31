import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { DataContextType, DataSource } from '.';

// Create a context for the data
export const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  dataSources: DataSource[];
  children: ReactNode;
}

const DataProvider: React.FC<DataProviderProps> = ({ dataSources, children }) => {
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, any>>({});
  const [subscriptions, setSubscriptions] = useState<Record<string, () => void>>({});
  const [dataSourcesState, setDataSourcesState] = useState<DataSource[]>(dataSources);

  const addDataSource = useCallback(
    (newDataSource: DataSource) => {
      setDataSourcesState((prev) => [...prev, newDataSource]);
    },
    [setDataSourcesState]
  );

  const setDataSource = useCallback((key: string, dataSource: DataSource['dataSource']) => {
    setDataSourcesState((prev) => prev.map((ds) => (ds.key === key ? { ...ds, dataSource } : ds)));
  }, []);

  const fetchData = useCallback(
    async (key: string, filter: object = {}) => {
      if (subscriptions[key]) return; // Skip if there is an active subscription

      setLoading((prev) => ({ ...prev, [key]: true }));
      setError((prev) => ({ ...prev, [key]: null }));
      try {
        const dataSource = dataSourcesState.find((ds) => ds.key === key)?.dataSource;
        if (!dataSource) throw new Error(`Data source with key ${key} not found`);
        const result = await dataSource.getAll(filter);
        setData((prev) => ({ ...prev, [key]: result }));
      } catch (err) {
        setError((prev) => ({ ...prev, [key]: err }));
      } finally {
        setLoading((prev) => ({ ...prev, [key]: false }));
      }
    },
    [dataSourcesState, subscriptions]
  );

  const subscribeToData = useCallback(
    (key: string) => {
      setLoading((prev) => ({ ...prev, [key]: true }));
      setError((prev) => ({ ...prev, [key]: null }));
      try {
        const dataSource = dataSourcesState.find((ds) => ds.key === key)?.dataSource;
        if (!dataSource) throw new Error(`Data source with key ${key} not found`);
        const unsubscribe = dataSource.subscribe((newData) => {
          setData((prev) => ({ ...prev, [key]: newData }));
          setLoading((prev) => ({ ...prev, [key]: false }));
        });
        setSubscriptions((prev) => ({ ...prev, [key]: unsubscribe }));
      } catch (err) {
        setError((prev) => ({ ...prev, [key]: err }));
        setLoading((prev) => ({ ...prev, [key]: false }));
      }
    },
    [dataSourcesState]
  );

  const add = async (key: string, item: any) => {
    setLoading((prev) => ({ ...prev, [key]: true }));
    setError((prev) => ({ ...prev, [key]: null }));
    try {
      const dataSource = dataSourcesState.find((ds) => ds.key === key)?.dataSource;
      if (!dataSource) throw new Error(`Data source with key ${key} not found`);
      const newItem = await dataSource.add(item);
      if (!subscriptions[key] && data[key]) {
        setData((prev) => ({ ...prev, [key]: [...prev[key], newItem] }));
      }
      return newItem;
    } catch (err) {
      setError((prev) => ({ ...prev, [key]: err }));
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const update = async (key: string, id: string, data: any) => {
    setLoading((prev) => ({ ...prev, [key]: true }));
    setError((prev) => ({ ...prev, [key]: null }));
    try {
      const dataSource = dataSourcesState.find((ds) => ds.key === key)?.dataSource;
      if (!dataSource) throw new Error(`Data source with key ${key} not found`);
      await dataSource.update(id, data);
      if (!subscriptions[key] && data[key]) {
        setData((prev) => ({
          ...prev,
          [key]: prev[key].map((item: any) => (item.id === id ? { ...item, ...data } : item)),
        }));
      }
    } catch (err) {
      setError((prev) => ({ ...prev, [key]: err }));
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const set = async (key: string, id: string, data: any) => {
    setLoading((prev) => ({ ...prev, [key]: true }));
    setError((prev) => ({ ...prev, [key]: null }));
    try {
      const dataSource = dataSourcesState.find((ds) => ds.key === key)?.dataSource;
      if (!dataSource) throw new Error(`Data source with key ${key} not found`);
      await dataSource.set(id, data);
      if (!subscriptions[key] && data[key]) {
        setData((prev) => ({
          ...prev,
          [key]: prev[key].map((item: any) => (item.id === id ? { ...item, ...data } : item)),
        }));
      }
    } catch (err) {
      setError((prev) => ({ ...prev, [key]: err }));
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const remove = async (key: string, id: string) => {
    setLoading((prev) => ({ ...prev, [key]: true }));
    setError((prev) => ({ ...prev, [key]: null }));
    try {
      const dataSource = dataSources.find((ds) => ds.key === key)?.dataSource;
      if (!dataSource) throw new Error(`Data source with key ${key} not found`);
      await dataSource.delete(id);
      if (!subscriptions[key] && data[key]) {
        setData((prev) => ({
          ...prev,
          [key]: prev[key].filter((item: any) => item.id !== id),
        }));
      }
    } catch (err) {
      setError((prev) => ({ ...prev, [key]: err }));
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  useEffect(() => {
    return () => {
      Object.values(subscriptions).forEach((unsubscribe) => unsubscribe());
    };
  }, [subscriptions]);

  useEffect(() => {
    console.log('Data sources have new data', data);
  }, [data]);

  return (
    <DataContext.Provider
      value={{
        dataSources: dataSourcesState,
        setDataSource,
        addDataSource,
        data,
        loading,
        error,
        fetchData,
        subscribeToData,
        subscriptions,
        add,
        update,
        set,
        remove,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
