import { AutocompleteProps, TextFieldProps } from '@mui/material';
import { FormikProps } from 'formik';

export interface FieldConfig {
  id?: string;
  name: string;
  label?: string;
  type?: string;
  definition?: string;
  initialValue?: any;
  render?: (config: FieldDefinitionConfig) => any;
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

// export interface GlobalFieldOptions extends FieldOptions {
//   owner?: string; // TODO: implement
//   preSave?: (value: any) => any; // TODO: implement
// }

// export interface UseFormFieldsProps {
//   fields: FieldConfig[];
//   options?: GlobalFieldOptions;
//   formikProps: {
//     onSubmit: (values: any, formikBag?: any) => any;
//     [key: string]: any;
//   };
// }

// export interface UseFormFieldsReturn {
//   formFields: { [key: string]: JSX.Element };
//   formik: FormikProps<any>;
//   save: () => any;
// }

export interface FieldDefinitionConfig {
  field: FieldConfig;
  formik: FormikProps<any>;
  options: FieldOptions;
  helpers: {
    add: () => any;
    remove: (index: number) => any;
    handleChange: (e: any) => any;
    value: any;
    errors: any;
    touched: any;
  };
}

export interface RenderFieldDefinitions {
  [key: string]: (config: FieldDefinitionConfig) => any;
}

export { default as CustomForm } from './custom-form';
