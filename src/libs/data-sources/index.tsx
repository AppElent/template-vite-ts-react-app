import { useContext } from 'react';
import * as Yup from 'yup';
import DataProvider, { DataContext } from './DataProvider';
import useData from './useData';

export interface DataSourceInitOptions {
  target: string;
  targetMode?: 'collection' | 'document' | 'number' | 'string' | 'boolean'; //TODO: implement
  subscribe?: boolean;
  YupValidationSchema?: Yup.AnySchema;
  schema?: Record<string, any>;
  defaultValue?: any;
  mock?: boolean; //TODO: implement
  mockOptions?: {
    count?: number;
    schema?: Record<string, any>;
  };
}

export interface DataSourceObject {
  [key: string]: any;
}

// export interface DataSource<T> {
//   key: string;
//   dataSource: DataSourceSource<T>;
// }

export interface DataSource<T> {
  // Options supplied to class constructor
  options?: DataSourceInitOptions;
  providerConfig?: any;
  // Provider name
  provider: string;
  // Predefined methods
  getAll: (filter?: object) => Promise<T[]>;
  get: (id?: string) => Promise<T | null>;
  add: (item: T) => Promise<T>;
  update: (data: Partial<T>, id?: string) => Promise<void>;
  set: (data: T, id?: string) => Promise<void>;
  delete: (id?: string) => Promise<void>;
  // Custom methods
  [key: string]: any;
}

// export interface DataContextType {
//   dataSources: DataSource[];
//   setDataSource: (key: string, dataSource: DataSource['dataSource']) => void;
//   addDataSource: (newDataSource: DataSource) => void;
//   data: Record<string, any>;
//   loading: Record<string, boolean>;
//   error: Record<string, any>;
//   fetchData: (key: string, filter?: object) => Promise<void>;
//   subscribeToData: (key: string) => void;
//   subscriptions: Record<string, () => void>;
//   add: (key: string, item: any) => Promise<any>;
//   update: (key: string, data: any, id: string) => Promise<void>;
//   set: (key: string, data: any, id: string) => Promise<void>;
//   remove: (key: string, id: string) => Promise<void>;
// }

// export interface DataSourceContext {
//   data: any;
//   loading: boolean;
//   error: any;
//   fetchData: (filter: any) => void;
//   get: (id?: string) => Promise<any> | undefined;
//   getAll: (filter: any) => Promise<any> | undefined;
//   add: (item: any) => Promise<any>;
//   update: (data: any, id: string) => Promise<void>;
//   set: (data: any, id: string) => Promise<void>;
//   delete: (id: string) => Promise<void>;
//   dataSource: DataSourceSource | undefined;
//   addDataSource: (newDataSource: DataSource) => void;
//   setDataSource: (key: string, dataSource: DataSourceSource) => void;
//   dataSources: DataSource[];
// }

export const useDataSources = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataSources must be used within a DataProvider');
  }
  return {
    dataSources: context.dataSources,
    addDataSource: context.addDataSource,
    setDataSource: context.setDataSource,
  };
};

export { DataProvider, useData };
