import { TextFieldProps } from '@mui/material';
import { FormikProps } from 'formik';

export interface FieldConfig {
  id?: string;
  name: string;
  label?: string;
  type?: string;
  initialValue?: any;
  render?: (config: FieldDefinitionConfig) => any;
  validation?: (value: any) => any; //Yup.AnySchema;
  custom?: FieldOptions;
}

export interface FieldOptions {
  muiTextFieldProps?: TextFieldProps;
  editMode?: boolean;
  [key: string]: any;
}

export interface UseFormFieldsProps {
  fields: FieldConfig[];
  options?: FieldOptions;
  formikProps?: any;
}

export interface UseFormFieldsReturn {
  formFields: { [key: string]: JSX.Element };
  formik: FormikProps<any>;
  save: () => any;
}

export interface FieldDefinitionConfig {
  field: FieldConfig;
  formik: FormikProps<any>;
  options: { [key: string]: any };
  helpers: {
    add: () => any;
    remove: (index: number) => any;
    value: any;
    errors: any;
    touched: any;
  };
}

export interface RenderFieldDefinitions {
  [key: string]: (config: FieldDefinitionConfig) => any;
}

export { default as CustomField } from './custom-field';
export { default as useFormFields } from './use-form-fields';
