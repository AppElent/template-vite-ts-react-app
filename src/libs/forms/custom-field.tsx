import FieldDefinitions from '@/config/field-definitions';
import isEqual from '@/utils/is-equal';
import { memo } from 'react';
import { FieldDefinitionConfig } from '.';
import { DefaultTextField } from './default-fields';

const CustomField = memo(
  ({ field, formik, options, helpers }: FieldDefinitionConfig) => {
    let ReturnField = (
      <DefaultTextField
        field={field}
        formik={formik}
        options={options}
        helpers={helpers}
      />
    );
    if (field.type && FieldDefinitions[field.type]) {
      ReturnField = FieldDefinitions[field.type]({ formik, field, options, helpers });
    }

    return ReturnField;
  },
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

export default CustomField;
