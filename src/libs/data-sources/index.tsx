import * as Yup from 'yup';
import DataProvider from './DataProvider';
import useData from './useData';

export interface DataSourceInitOptions {
  target: string;
  targetMode: 'collection' | 'document';
  YupValidationSchema: Yup.AnySchema;
}

export interface DataSource {
  key: string;
  dataSource: DataSourceSource;
}

export interface DataSourceSource {
  getAll: (filter: object) => Promise<any>;
  get: (id?: string) => Promise<any>;
  subscribe: (callback: (newData: any) => void) => () => void;
  add: (item: any) => Promise<any>;
  update: (id: string, data?: any) => Promise<void>;
  set: (id: string, data?: any) => Promise<void>;
  delete: (id?: string) => Promise<void>;
}

export interface DataContextType {
  dataSources: DataSource[];
  setDataSource: (key: string, dataSource: DataSource['dataSource']) => void;
  addDataSource: (newDataSource: DataSource) => void;
  data: Record<string, any>;
  loading: Record<string, boolean>;
  error: Record<string, any>;
  fetchData: (key: string, filter?: object) => Promise<void>;
  subscribeToData: (key: string) => void;
  subscriptions: Record<string, () => void>;
  add: (key: string, item: any) => Promise<any>;
  update: (key: string, id: string, data: any) => Promise<void>;
  set: (key: string, id: string, data: any) => Promise<void>;
  remove: (key: string, id: string) => Promise<void>;
}

export interface DataSourceContext {
  data: any;
  loading: boolean;
  error: any;
  fetchData: (filter: any) => void;
  get: (id?: string) => Promise<any> | undefined;
  getAll: (filter: any) => Promise<any> | undefined;
  add: (item: any) => Promise<any>;
  update: (id: string, data: any) => Promise<void>;
  set: (id: string, data: any) => Promise<void>;
  delete: (id: string) => Promise<void>;
  dataSource: DataSourceSource | undefined;
  addDataSource: (newDataSource: DataSource) => void;
  setDataSource: (key: string, dataSource: DataSourceSource) => void;
}

export { DataProvider, useData };
