import { AutocompleteProps, TextFieldProps } from '@mui/material';

export interface FieldConfig {
  id?: string;
  name: string;
  label?: string;
  type?: string;
  definition?: string;
  initialValue?: any;
  //render?: (config: FieldDefinitionConfig) => any;
  validation?: (value: any) => any; //Yup.AnySchema;
  custom?: FieldOptions;
}

export interface FieldOptions {
  muiTextFieldProps?: TextFieldProps;
  muiAutoCompleteProps?: AutocompleteProps<any, any, any, any>;
  editMode?: boolean;
  debounce?: number;
  [key: string]: any;
}

// export interface FieldDefinitionConfig {
//   field: FieldConfig;
//   formik: FormikProps<any>;
//   options: FieldOptions;
//   helpers: {
//     add: () => any;
//     remove: (index: number) => any;
//     handleChange: (e: any) => any;
//     value: any;
//     errors: any;
//     touched: any;
//   };
// }

// export interface RenderFieldDefinitions {
//   [key: string]: (config: FieldDefinitionConfig) => any;
// }

export { default as CustomForm } from './custom-form';
export { default as useFormButton } from './use-form-button';
export { default as useFormField } from './use-form-field';
