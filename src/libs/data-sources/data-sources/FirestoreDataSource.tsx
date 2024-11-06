import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentSnapshot,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  setDoc,
  UpdateData,
  updateDoc,
  where,
} from 'firebase/firestore';
import { DataSourceInitOptions } from '..';
import BaseDataSource from './BaseDataSource';

interface FirestoreDataSourceProviderConfig {
  db: any;
}

export class FirestoreDataSource<T> extends BaseDataSource<T> {
  firestore: any;
  ref: any;

  constructor(options: DataSourceInitOptions, providerConfig: FirestoreDataSourceProviderConfig) {
    super(options, providerConfig);

    this.provider = 'Firestore';
    this.firestore = providerConfig.db;
    if (this.options.targetMode === 'collection') {
      this.ref = collection(this.firestore, this.targetName);
    } else if (this.options.targetMode === 'document') {
      this.ref = doc(this.firestore, this.targetName);
    }
  }

  tryCatch = async (fn: () => any) => {
    try {
      return await fn();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  // Get a single document by ID
  async get(id?: string): Promise<T | null> {
    try {
      if (!id && this.options.targetMode !== 'document') {
        throw new Error('get() requires an ID when using collections');
      }
      const docRef = this.options?.targetMode === 'document' ? this.ref : doc(this.ref, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return { id: docSnap.id, ...(data ? data : {}) } as T;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

  // Get all documents in the collection, with optional filters
  async getAll(filter: { [key: string]: any } = {}): Promise<T[]> {
    try {
      if (this.options.targetMode !== 'collection')
        throw new Error('getAll() can only be used with collections');
      let q = this.ref;
      Object.keys(filter).forEach((key) => {
        q = query(q, where(key, '==', filter[key]));
      });

      const querySnapshot = await getDocs(q);
      const documents: any[] = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...(doc.data() as object) });
      });
      return documents as T[];
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  }

  // Add a new document to the collection
  async add(item: T): Promise<T> {
    try {
      if (this.options.targetMode !== 'collection')
        throw new Error('add() can only be used with collections');
      // Validate new data
      this.validate(item, { full: false });
      const docRef = await addDoc(this.ref, item);
      const newDoc = await getDoc(docRef);
      return { id: docRef.id, ...newDoc.data() } as T;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  // Update an existing document by ID
  async update(data: Partial<T>, id?: string): Promise<void> {
    try {
      if (!id && this.options.targetMode !== 'document') {
        throw new Error('update() requires an ID when using collections');
      }
      const docRef = this.options?.targetMode === 'document' ? this.ref : doc(this.ref, id);
      this.validate(data);
      await updateDoc(docRef, data as UpdateData<Partial<T>>);
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  // Update an existing document by ID
  async set(data: T, id?: string): Promise<void> {
    try {
      // Validate updated data
      if (!id && this.options.targetMode !== 'document') {
        throw new Error('set() requires an ID when using collections');
      }
      this.validate(data);
      const docRef = this.options?.targetMode === 'document' ? this.ref : doc(this.ref, id);
      await setDoc(docRef, data);
    } catch (error) {
      console.error('Error setting document:', error);
      throw error;
    }
  }

  // Delete a document by ID
  async delete(id?: string): Promise<void> {
    try {
      if (!id && this.options.targetMode !== 'document') {
        throw new Error('get() requires an ID when using collections');
      }
      const docRef = this.options?.targetMode === 'document' ? this.ref : doc(this.ref, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  // Subscribe to real-time updates for the collection
  subscribe(callback: (data: any) => any) {
    const unsubscribe =
      this.options?.targetMode === 'document'
        ? onSnapshot(this.ref, (snapshot: DocumentSnapshot) => {
            const data = snapshot.data();
            if (data) {
              callback({ id: snapshot.id, ...snapshot.data() });
            } else {
              callback(null);
            }
          })
        : onSnapshot(this.ref, (snapshot: QuerySnapshot) => {
            const documents: T[] = [];
            snapshot.forEach((doc: QueryDocumentSnapshot) => {
              documents.push({ id: doc.id, ...doc.data() } as T);
            });
            callback(documents);
          });

    // Return a function to unsubscribe from real-time updates
    return () => unsubscribe();
  }
}

export default FirestoreDataSource;
