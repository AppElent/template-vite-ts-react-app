/* eslint-disable @typescript-eslint/no-unused-vars */
export interface StorageClassOptions {
  [key: string]: any;
}

export default class BaseStorageProvider {
  options: StorageClassOptions;
  providerOptions: any;

  constructor(options: any, providerOptions?: any) {
    this.options = options;
    this.providerOptions = providerOptions;
    this.uploadFile = this.uploadFile.bind(this);
    this.getFile = this.getFile.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
  }

  // You can also add helper methods that could be useful across storage classes.
  formatFilePath(path: string): string {
    // Example of a shared helper method
    return path.startsWith('/') ? path : `/${path}`;
  }

  async uploadFile(_file: File, _path: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async getFile(_fileId: string): Promise<File> {
    throw new Error('Method not implemented.');
  }

  async deleteFile(_fileId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
