import CustomField from '@/components/default/CustomField';
import { FormikProps, useFormik } from 'formik';

export interface FieldConfig {
  id?: string;
  name: string;
  label?: string;
  type: string;
  initialValue?: any;
  validation?: (value: any) => any; //Yup.AnySchema;
  props?: any;
  custom?: {
    [key: string]: any;
  };
}

interface UseFormFieldsReturn {
  formFields: { [key: string]: JSX.Element };
  formik: FormikProps<any>;
  save: () => void;
}

const useFormFields = (
  fieldsConfig: FieldConfig[],
  globalOptions?: any,
  formikProps?: any
): UseFormFieldsReturn => {
  let initialValues = fieldsConfig.reduce((acc: any, field: FieldConfig) => {
    acc[field.name] = field.initialValue || '';
    return acc;
  }, {});
  if (formikProps && formikProps.initialValues) {
    initialValues = {
      ...formikProps.initialValues,
      ...initialValues,
    };
  }

  // const validationSchema = Yup.object(
  //   fieldsConfig.reduce((acc: any, field) => {
  //     if (field.validation) {
  //       acc[field.name] = field.validation;
  //     }
  //     return acc;
  //   }, {})
  // );

  const formik = useFormik({
    initialValues,
    //validationSchema,
    onSubmit: (values) => {
      console.log('Form Submitted:', values);
    },
    ...formikProps,
  });

  // const DefaultField = ({ field, formik }: { field: FieldConfig; formik: FormikProps<any> }) => {
  //   return (
  //     <TextField
  //       key={field.name}
  //       margin="dense"
  //       name={field.name}
  //       label={field.label}
  //       type={field.type}
  //       value={formik.values[field.name]}
  //       onChange={formik.handleChange}
  //       onBlur={formik.handleBlur}
  //       error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
  //       helperText={formik.touched[field.name] && formik.errors[field.name]}
  //       {...field.props}
  //     />
  //   );
  // };

  const formFields = fieldsConfig.reduce((acc: any, field: FieldConfig) => {
    const key = field.id || field.name;

    const options = {
      ...globalOptions,
      ...field.custom,
    };

    acc[key] = (
      <CustomField
        field={field}
        formik={formik}
        options={options}
      />
    );

    // const fieldDefinition: (config: FieldDefinitionConfig) => any = FieldDefinitions[field.type];
    // if (fieldDefinition) {
    //   acc[key] = fieldDefinition({ formik, field, options: { editMode } });
    // } else {
    //   acc[key] = (
    //     <DefaultField
    //       field={field}
    //       formik={formik}
    //     />
    //   ); //fieldDefinitions.fieldDefinitions.default();
    // }

    return acc;
  }, {});

  return { formFields, formik, save: formik.handleSubmit };
};

export default useFormFields;
