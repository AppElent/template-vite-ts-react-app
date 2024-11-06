// @ts-nocheck

import { DataSourceInitOptions } from '..';
import BaseDataSource from './BaseDataSource';
import LocalStorageDataSource from './LocalStorageDataSource';

//TODO: Implement the MockDataSource class

export class MockDataSource<T> extends BaseDataSource<T> {
  constructor(options: DataSourceInitOptions, providerConfig?: any) {
    super(options, providerConfig);
  }

  // Get a single item by ID
  async get(id?: string): Promise<T | null> {
    return null;
  }

  // Get all items, with optional filters
  async getAll(filter: { [key: string]: any } = {}) {
    return filter;
  }

  // Add a new item
  async add(item: any) {
    return item;
  }

  // Update an existing item by ID
  async update(id: any, data?: any) {
    return id, data;
  }

  // Set an existing item by ID
  async set(id?: any, data?: any) {
    return id, data;
  }

  // Delete an item by ID
  async delete(id?: string) {
    return id;
  }

  // Subscribe to changes in the storage data
  subscribe(callback: (data: any) => any) {
    //?
  }
}

export default LocalStorageDataSource;
