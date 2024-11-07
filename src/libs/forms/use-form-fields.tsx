// @ts-nocheck

import { useFormik } from 'formik';

import { useMemo } from 'react';
import { FieldConfig, UseFormFieldsProps, UseFormFieldsReturn } from '.';
import CustomField from './custom-field';

const defaultOptions = {
  editMode: false,
};

const setNestedValue = (obj: any, path: string, value: any) => {
  const keys = path.split('.');
  let current = obj;
  while (keys.length > 1) {
    const key = keys.shift();
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }
  current[keys[0]] = value;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, key) => acc && acc[key], obj);
};

// TODO: if no fieldsConfig provider, infer from yup validationschema

const useFormFields = ({
  fields: fieldsConfig,
  options: globalOptions,
  formikProps,
}: UseFormFieldsProps): UseFormFieldsReturn => {
  let initialValues = fieldsConfig.reduce((acc: any, field: FieldConfig) => {
    if (field.initialValue) {
      setNestedValue(acc, field.name, field.initialValue);
    }

    return acc;
  }, {});
  if (formikProps && formikProps.initialValues) {
    initialValues = {
      ...formikProps.initialValues,
      ...initialValues,
    };
  }
  initialValues = {
    ...(formikProps && formikProps.initialValues && formikProps.initialValues),
    ...(formikProps && formikProps.validationSchema && formikProps.validationSchema.getDefault()),
    ...initialValues,
  };

  const formik = useFormik({
    initialValues,
    //validationSchema,
    onSubmit: (values) => {
      console.log('Form Submitted:', values);
    },
    ...formikProps,
  });

  const formFields = useMemo(
    () =>
      fieldsConfig.reduce((acc: any, field: FieldConfig) => {
        const key = field.id || field.name;

        const helpers = {
          add: () => {
            const currentArray = getNestedValue(formik.values, field.name) || [];
            setNestedValue(formik.values, field.name, [...currentArray, '']);
            formik.setFieldValue(field.name, [...currentArray, '']);
          },
          remove: (index: number) => {
            const currentArray = getNestedValue(formik.values, field.name) || [];
            const newArray = [...currentArray];
            newArray.splice(index, 1);
            setNestedValue(formik.values, field.name, newArray);
            formik.setFieldValue(field.name, newArray);
          },
          errors: getNestedValue(formik.errors, field.name),
          value: getNestedValue(formik.values, field.name),
          touched: getNestedValue(formik.touched, field.name),
        };

        function mergeObjects(...objects: object[]) {
          return objects.reduce((acc: any, obj: any) => {
            Object.keys(obj).forEach((key) => {
              if (key.startsWith('mui') && key.endsWith('Props')) {
                acc[key] = {
                  ...acc[key],
                  ...obj[key],
                };
              } else {
                acc[key] = obj[key];
              }
            });
            return acc;
          }, {});
        }

        const options = mergeObjects(
          defaultOptions || {},
          globalOptions || {},
          field?.custom || {}
        );

        if (field.render && typeof field.render === 'function') {
          acc[key] = field.render({ field, formik, options, helpers });
          //return acc;
        } else {
          acc[key] = (
            <CustomField
              field={field}
              formik={formik}
              options={options}
              helpers={helpers}
            />
          );
        }

        return acc;
      }, {}),
    [fieldsConfig, formik, globalOptions]
  );

  return { formFields, formik, save: formik.handleSubmit };
};

export default useFormFields;
