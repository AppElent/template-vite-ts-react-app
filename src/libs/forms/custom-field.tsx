import FieldDefinitions from '@/config/field-definitions';
import Recipe from '@/types/recipe';
import { useFormikContext } from 'formik';
import _, { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FieldConfig, FieldDefinitionConfig } from '.';
import { useFormOptions } from './custom-form';
import { DefaultTextField } from './default-fields';

/**
 * Sets the value at the given path of the object.
 * @param {any} obj - The object to modify.
 * @param {string} path - The path of the property to set.
 * @param {any} value - The value to set.
 */
const setNestedValue = (obj: any, path: string, value: any) => {
  _.set(obj, path, value);
};

/**
 * Gets the value at the given path of the object.
 * @param {any} obj - The object to query.
 * @param {string} path - The path of the property to get.
 * @returns {any} - Returns the resolved value.
 */
const getNestedValue = (obj: any, path: string) => {
  return _.get(obj, path);
};

const CustomField = ({ field }: { field: FieldConfig }) => {
  const formik = useFormikContext<Recipe>();
  const options = useFormOptions();
  const [inputValue, setInputValue] = useState(getNestedValue(formik.values, field?.name));

  useEffect(() => {
    if (
      formik.values[field.name as keyof Recipe] &&
      formik.values[field.name as keyof Recipe] !== inputValue
    ) {
      setInputValue(formik.values[field.name as keyof Recipe]);
    }
  }, [field?.name, formik.values]);
  //const fieldDefaults = options?.fieldDefaults?.[type] || {};

  const add = useCallback(() => {
    const currentArray = getNestedValue(formik.values, field.name) || [];
    setNestedValue(formik.values, field.name, [...currentArray, '']);
    formik.setFieldValue(field.name, [...currentArray, '']);
  }, [field?.name, formik.values]);

  const remove = useCallback(
    (index: number) => {
      const currentArray = getNestedValue(formik.values, field.name) || [];
      const newArray = [...currentArray];
      newArray.splice(index, 1);
      setNestedValue(formik.values, field.name, newArray);
      formik.setFieldValue(field.name, newArray);
    },
    [field?.name, formik.values]
  );

  // Debounced function to update Formik's state
  const debouncedHandleChange = useMemo(
    () =>
      debounce((value) => {
        //console.log('jaja', value);
        formik.setFieldValue(field.name, value);
      }, 300), // Adjust delay as needed
    [formik]
  );

  /**
   * Handles input change events.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleInputChange = useCallback(
    (e: any) => {
      const { name, value } = e.target;
      let newValue;

      if (Array.isArray(inputValue)) {
        const index = parseInt(name.match(/\[(\d+)\]/)[1], 10);
        newValue = [...inputValue];
        newValue[index] = value;
      } else if (inputValue instanceof Date) {
        newValue = new Date(value);
      } else if (typeof inputValue === 'number') {
        newValue = parseFloat(value);
      } else if (typeof inputValue === 'object') {
        newValue = { ...inputValue, [name]: value };
      } else {
        newValue = value;
      }

      setInputValue(newValue); // Update local state immediately
      debouncedHandleChange(newValue); // Update Formik's state with a delay
    },
    [debouncedHandleChange, inputValue]
  );

  const helpers = useMemo(
    () => ({
      add,
      remove,
      handleChange: handleInputChange,
      errors: getNestedValue(formik.errors, field?.name),
      value: inputValue, //getNestedValue(formik.values, field.name),
      touched: getNestedValue(formik.touched, field?.name),
    }),
    [add, remove, handleInputChange, formik.errors, formik.touched, field?.name, inputValue]
  );

  const mergedOptions = useMemo(
    () => field && _.merge({}, options || {}, field.custom || {}),
    [field, options]
  );

  //const defaultProps = fieldDefinition?.props || {};

  // Merge props with global options and field-specific overrides
  //   const fieldProps = {
  //     ...defaultProps,
  //     ...globalOptions?.fieldDefaults?.[type], // Apply global defaults for this field type
  //     ...props,
  //     name,
  //     value: values[name],
  //     onChange: handleChange,
  //     onBlur: handleBlur,
  //     setFieldValue,
  //   };

  const fieldProps: FieldDefinitionConfig = useMemo(
    () =>
      field && {
        field,
        formik,
        options: mergedOptions,
        helpers,
      },
    [field, formik, mergedOptions, helpers]
  );

  if (!field) return <></>;

  const fieldDefinition = field?.definition ? FieldDefinitions[field.definition] : undefined;
  if (!fieldDefinition) {
    return <DefaultTextField {...fieldProps} />;
  }

  return field.render ? field.render(fieldProps) : fieldDefinition(fieldProps);
};

export default CustomField;
