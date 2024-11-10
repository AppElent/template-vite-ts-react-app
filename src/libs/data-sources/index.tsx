import { useContext } from 'react';
import * as Yup from 'yup';
import DataProvider, { DataContext } from './DataProvider';
import useData from './useData';

export interface DataSourceInitOptions<T> {
  target: string;
  targetMode?: 'collection' | 'document' | 'number' | 'string' | 'boolean'; //TODO: implement
  targetFilter?: FilterObject<T>;
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
  options?: DataSourceInitOptions<T>;
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

/**
 * Represents the various operators that can be used to filter data.
 *
 * @typedef {('==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in' | 'not-in' | 'array-contains-any')} FilterOperator
 *
 * @property {'=='} EQUAL - Checks if a value is equal to another value.
 * @property {'!='} NOT_EQUAL - Checks if a value is not equal to another value.
 * @property {'<'} LESS_THAN - Checks if a value is less than another value.
 * @property {'<='} LESS_THAN_OR_EQUAL - Checks if a value is less than or equal to another value.
 * @property {'>'} GREATER_THAN - Checks if a value is greater than another value.
 * @property {'>='} GREATER_THAN_OR_EQUAL - Checks if a value is greater than or equal to another value.
 * @property {'array-contains'} ARRAY_CONTAINS - Checks if an array contains a specific value.
 * @property {'in'} IN - Checks if a value is in a list of values.
 * @property {'not-in'} NOT_IN - Checks if a value is not in a list of values.
 * @property {'array-contains-any'} ARRAY_CONTAINS_ANY - Checks if an array contains any of the specified values.
 */
export type FilterOperator =
  | '=='
  | '!='
  | '<'
  | '<='
  | '>'
  | '>='
  | 'array-contains'
  | 'in'
  | 'not-in'
  | 'array-contains-any';

export interface FilterObject<T> {
  limit?: number;
  orderBy?: { field: keyof T; direction: 'asc' | 'desc' }[];
  pagination?: { page: number; pageSize: number };
  filters?: { field: keyof T; operator: FilterOperator; value: any }[];
  select?: (keyof T)[];
}

export interface FilterReturn<T> {
  provider: any;
  postFilter: FilterObject<T>;
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
