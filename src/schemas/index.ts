export interface Schema {
  [key: string]: {
    required?: boolean;
    type?: string;
    minLength?: number;
  };
}
