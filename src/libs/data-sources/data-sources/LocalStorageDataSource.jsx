export class LocalStorageDataSource {
  constructor(key, options) {
    this.provider = 'LocalStorage';
    this.key = key;
    this.data = JSON.parse(localStorage.getItem(key)) || [];
    this.options = options;
  }

  // Save the collection to localStorage
  _save() {
    localStorage.setItem(this.key, JSON.stringify(this.collection));
  }

  // Get a single document by ID
  async get(id) {
    const doc = this.data.find((item) => item.id === id);
    return doc || null;
  }

  // Get all documents in the collection, with optional filters
  async getAll(filter = {}) {
    let documents = [...this.data];
    Object.keys(filter).forEach((key) => {
      documents = documents.filter((doc) => doc[key] === filter[key]);
    });
    return documents;
  }

  // Add a new document to the collection
  async add(item) {
    const id = Date.now().toString();
    const newDoc = { id, ...item };
    this.data.push(newDoc);
    this._save();
    return newDoc;
  }

  // Update an existing document by ID
  async update(id, data) {
    const index = this.data.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...data };
      this._save();
    } else {
      throw new Error('Document not found');
    }
  }

  // Delete a document by ID
  async delete(id) {
    const index = this.data.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.data.splice(index, 1);
      this._save();
    } else {
      throw new Error('Document not found');
    }
  }

  // Subscribe to changes (simulated for localStorage)
  subscribe(callback) {
    const handleStorageChange = (event) => {
      if (event.key) {
        callback(event);
      }
    };

    // Listen for changes in localStorage from other documents
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom local-storage events within the same document
    window.addEventListener('local-storage', handleStorageChange);

    // Return a function to remove the event listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }
}

export default LocalStorageDataSource;
