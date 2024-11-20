import { FieldConfig } from '@/libs/forms';
import useFormField from '@/libs/forms/use-form-field';
import { TextField as DTextField, TextFieldProps } from '@mui/material';
import _ from 'lodash';

interface CustomTextFieldProps {
  name: string;
  field?: FieldConfig;
  muiTextFieldProps?: TextFieldProps;
}

const TextField = ({ name, field: fieldConfig, ...props }: CustomTextFieldProps) => {
  const fieldName = fieldConfig ? fieldConfig.name : name;
  const data = useFormField(fieldName, fieldConfig);
  const { options, field, meta } = data;

  const newProps = _.merge({}, options, props);

  return (
    <DTextField
      key={fieldName}
      margin="dense"
      name={fieldName}
      label={fieldConfig?.label || fieldName}
      value={field.value || ''}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
      {...newProps?.muiTextFieldProps}
    />
  );
};

export default TextField;
