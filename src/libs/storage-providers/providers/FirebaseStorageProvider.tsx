import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import BaseStorageProvider, { StorageClassOptions } from './BaseStorageProvider';

interface FirebaseStorageOptions {
  instance: any;
}

class FirebaseStorageProvider extends BaseStorageProvider {
  constructor(options: StorageClassOptions, providerOptions: FirebaseStorageOptions) {
    super(options, providerOptions);
  }
  async uploadFile(file: File, path: string): Promise<string> {
    const storage = getStorage();
    const fileRef = ref(storage, this.formatFilePath(path));
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  }

  async getFile(fileId: string): Promise<any> {
    const storage = getStorage();
    const fileRef = ref(storage, fileId);
    const url = await getDownloadURL(fileRef);
    const response = await fetch(url);
    return await response.blob();
  }

  async deleteFile(fileId: string): Promise<void> {
    const storage = getStorage();
    const fileRef = ref(storage, fileId);
    await deleteObject(fileRef);
  }
}

export default FirebaseStorageProvider;
