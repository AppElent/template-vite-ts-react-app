import isEqual from '@/utils/is-equal';
import { TextField, Typography } from '@mui/material';
import { memo } from 'react';
import { FieldDefinitionConfig } from '.';

export const DefaultTextField = memo(
  ({ field, formik, options, helpers }: FieldDefinitionConfig): any =>
    !options?.editMode ? (
      <Typography
        key={field.name}
        variant="body1"
        margin="normal"
        {...(options?.muiTypographyProps && options.muiTypographyProps)}
      >
        {field.label}: {helpers.value}
      </Typography>
    ) : (
      <TextField
        key={field.name}
        margin="dense"
        name={field.name}
        label={field.label}
        type={field.type}
        value={helpers.value || ''}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={helpers.touched && Boolean(helpers.errors)}
        helperText={helpers.touched && helpers.errors}
        //{...field.props}
        {...(options?.muiTextFieldProps && options.muiTextFieldProps)}
      />
    ),
  (prevProps, nextProps) => {
    return (
      isEqual(prevProps.field, nextProps.field) &&
      isEqual(prevProps.options, nextProps.options) &&
      isEqual(prevProps.helpers.value, nextProps.helpers.value) &&
      isEqual(prevProps.helpers.errors, nextProps.helpers.errors) &&
      isEqual(prevProps.helpers.touched, nextProps.helpers.touched)
    );
  }
);
