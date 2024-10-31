import FieldDefinitions, { FieldDefinitionConfig } from '@/config/field-definitions';
import { FieldConfig } from '@/hooks/use-form-fields';
import { TextField } from '@mui/material';
import { FormikProps } from 'formik';

const CustomField = ({ field, formik, options }: FieldDefinitionConfig) => {
  const DefaultField = ({ field, formik }: { field: FieldConfig; formik: FormikProps<any> }) => {
    return (
      <TextField
        key={field.name}
        margin="dense"
        name={field.name}
        label={field.label}
        type={field.type}
        value={formik.values[field.name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
        helperText={formik.touched[field.name] && formik.errors[field.name]}
        {...field.props}
      />
    );
  };

  let ReturnField = (
    <DefaultField
      field={field}
      formik={formik}
    />
  );
  const fieldDefinition: (config: FieldDefinitionConfig) => any = FieldDefinitions[field.type];
  if (fieldDefinition) {
    ReturnField = fieldDefinition({ formik, field, options });
  }

  return ReturnField;
};

export default CustomField;
