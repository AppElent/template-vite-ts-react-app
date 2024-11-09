import { DataSourceInitOptions } from '..';

interface validateOptions {
  full: boolean;
}

class BaseDataSource<T> {
  protected defaultOptions = {
    targetMode: 'collection' as const,
    subscribe: false,
  };
  options: DataSourceInitOptions;
  providerConfig: any;
  //targetName: string;
  provider: string;
  constructor(options: DataSourceInitOptions, providerConfig: any) {
    if (new.target === BaseDataSource) {
      throw new TypeError('Cannot construct BaseDataSource instances directly');
    }
    this.provider = 'Base';
    this.providerConfig = providerConfig;
    this.options = {
      ...this.defaultOptions,
      ...options,
    };
    //this.targetName = options.target;
  }

  // Helper function to validate email format
  #isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Helper function to validate date
  #isValidDate(date: string) {
    return !isNaN(new Date(date).getTime());
  }

  #validateSchema = async (data: Partial<T>, _options?: validateOptions) => {
    if (this.options.schema) {
      const errors = [];
      for (const [key, rules] of Object.entries(this.options.schema)) {
        const value = (data as { [key: string]: any })[key];

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
              if (!this.#isValidDate(value)) errors.push(`${key} must be a valid date.`);
              break;
            case 'email':
              if (!this.#isValidEmail(value)) errors.push(`${key} must be a valid email.`);
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

  #validateYupSchema = async (data: Partial<T>, _options?: validateOptions) => {
    if (this.options.YupValidationSchema) {
      try {
        // Validate the data using Yup's schema and throw any validation errors
        await this.options.YupValidationSchema.validate(data, { abortEarly: false });
      } catch (err: any) {
        const validationErrors = err.errors?.join(' ');
        throw new Error(`Validation failed: ${validationErrors}`);
      }
    }
  };

  validate = async (data: Partial<T>, options?: validateOptions) => {
    await this.#validateSchema(data, options);
    await this.#validateYupSchema(data, options);
  };

  protected _getDefaultValue = () => {
    let fallback;

    switch (this.options.targetMode) {
      case 'collection':
        fallback = [];
        break;
      case 'document':
        fallback = {};
        break;
      case 'string':
        fallback = '';
        break;
      case 'number':
        fallback = 0;
        break;
      case 'boolean':
        fallback = false;
        break;
      default:
        fallback = null;
        break;
    }
    return this.options.defaultValue || fallback;
  };

  protected _parseFilters = () => {
    throw new Error("Method '_parseFilters' is not implemented.");
  };

  async get(): Promise<T | null> {
    throw new Error("Method 'get' must be implemented.");
  }

  async getAll(): Promise<T[]> {
    throw new Error("Method 'getAll' must be implemented.");
  }

  async add(_item: T): Promise<T> {
    throw new Error("Method 'add' must be implemented.");
  }

  async update(_data: Partial<T>, _id?: string): Promise<void> {
    throw new Error("Method 'update' must be implemented.");
  }

  async set(_data: T, _id?: string): Promise<void> {
    throw new Error("Method 'set' must be implemented.");
  }

  async delete(): Promise<void> {
    throw new Error("Method 'delete' must be implemented.");
  }
}

export default BaseDataSource;
