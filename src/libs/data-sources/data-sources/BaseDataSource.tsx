// @ts-nocheck
interface DataSourceOptions {
  target: string;
  schema?: Record<string, any>;
  YupValidationSchema?: any;
  targetMode?: 'collection' | 'document';
}

class BaseDataSource {
  defaultOptions = {
    targetMode: 'collection',
  };
  options: DataSourceOptions;
  providerConfig: any;
  targetName: string;
  constructor(options: DataSourceOptions, providerConfig: any) {
    if (new.target === BaseDataSource) {
      throw new TypeError('Cannot construct BaseDataSource instances directly');
    }
    this.providerConfig = providerConfig;
    this.options = {
      ...this.defaultOptions,
      ...options,
    };
    this.targetName = options.target;
  }

  // Helper function to validate email format
  isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Helper function to validate date
  isValidDate(date: string) {
    return !isNaN(new Date(date).getTime());
  }

  validateSchema = async (data) => {
    if (this.options.schema) {
      const errors = [];
      for (const [key, rules] of Object.entries(this.schema)) {
        const value = data[key];

        // Check required fields
        if (rules.required && (value === undefined || value === null)) {
          errors.push(`${key} is required.`);
          continue;
        }

        // Check data type
        if (rules.type) {
          switch (rules.type) {
            case 'string':
              if (typeof value !== 'string') errors.push(`${key} must be a string.`);
              break;
            case 'number':
              if (typeof value !== 'number') errors.push(`${key} must be a number.`);
              break;
            case 'boolean':
              if (typeof value !== 'boolean') errors.push(`${key} must be a boolean.`);
              break;
            case 'date':
              if (!this.isValidDate(value)) errors.push(`${key} must be a valid date.`);
              break;
            case 'email':
              if (!this.isValidEmail(value)) errors.push(`${key} must be a valid email.`);
              break;
            default:
              break;
          }
        }

        // Check for uniqueness (additional logic needed for Firestore)
        // Additional validation rules (e.g., minLength, maxLength, custom validators) can be added here
      }

      if (errors.length > 0) {
        throw new Error(errors.join(' '));
      }
    }
  };

  validateYupSchema = async (data) => {
    if (this.options.YupValidationSchema) {
      try {
        // Validate the data using Yup's schema and throw any validation errors
        await this.options.YupValidationSchema.validate(data, { abortEarly: false });
      } catch (err) {
        const validationErrors = err.errors.join(' ');
        throw new Error(`Validation failed: ${validationErrors}`);
      }
    }
  };

  validate = async (data) => {
    await this.validateSchema(data);
    await this.validateYupSchema(data);
  };

  _parseFilters = () => {
    throw new Error("Method '_parseFilters' is not implemented.");
  };

  async get(id) {
    throw new Error("Method 'get' must be implemented.");
  }

  async getAll(filter = {}) {
    throw new Error("Method 'getAll' must be implemented.");
  }

  async add(item) {
    throw new Error("Method 'add' must be implemented.");
  }

  async update(id, data) {
    throw new Error("Method 'update' must be implemented.");
  }

  async set(id, data) {
    throw new Error("Method 'set' must be implemented.");
  }

  async delete(id) {
    throw new Error("Method 'delete' must be implemented.");
  }
}

export default BaseDataSource;
