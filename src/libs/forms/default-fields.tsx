import { Link, TextField, Typography } from '@mui/material';
import _ from 'lodash';
import { memo } from 'react';
import { FieldDefinitionConfig } from '.';

/**
 * DefaultTextField component
 * @param {FieldDefinitionConfig} props - The props for the component
 * @returns {JSX.Element} The rendered component
 */
export const DefaultTextField = memo(
  ({ field, formik, options, helpers }: FieldDefinitionConfig): any => {
    if (options?.editMode) {
      return (
        <TextField
          key={field.name}
          margin="dense"
          name={field.name}
          label={field.label}
          type={field.type}
          value={helpers.value || ''}
          onChange={helpers.handleChange}
          onBlur={formik.handleBlur}
          error={helpers.touched && Boolean(helpers.errors)}
          helperText={helpers.touched && helpers.errors}
          {...(options?.muiTextFieldProps && options.muiTextFieldProps)}
        />
      );
    }

    if (helpers.value !== undefined) {
      return (
        <Typography
          key={field.name}
          variant="body1"
          margin="normal"
          {...(options?.muiTypographyProps && options.muiTypographyProps)}
        >
          {field.type === 'url' ? (
            <>
              {field.label}:{' '}
              <Link
                target="_blank"
                href={helpers.value}
              >
                {helpers.value}
              </Link>
            </>
          ) : (
            `${field.label}: ${helpers.value || ''}`
          )}
        </Typography>
      );
    }

    return null;
  },
  (prevProps, nextProps) => {
    return (
      _.isEqual(prevProps.field, nextProps.field) &&
      _.isEqual(prevProps.options, nextProps.options) &&
      _.isEqual(prevProps.helpers, nextProps.helpers)
    );
  }
);
