export interface Schema {
  [key: string]: {
    required?: boolean;
    type?: string;
    minLength?: number;
  };
}

// export const extractSchemaLabels = (schema: Yup.ObjectSchema<any>) => {
//   const fields = schema.fields;
//   const result = Object.keys(fields).map((key) => ({
//     name: key,
//     label: fields[key].describe().label || key,
//   }));
//   return result;
// };
