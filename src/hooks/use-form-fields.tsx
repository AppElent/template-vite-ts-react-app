import { useFormik } from 'formik';
import * as Yup from 'yup';
import FieldDefinitions from '@/config/field-definitions';

export interface FieldConfig {
  id?: string;
  name: string;
  label?: string;
  type: string;
  initialValue?: any;
  validation?: any;
  props?: any;
}

const useFormFields = (fieldsConfig: FieldConfig[], editMode?: boolean, formikProps?: any): any => {
  const initialValues = fieldsConfig.reduce((acc: any, field: FieldConfig) => {
    acc[field.name] = field.initialValue || '';
    return acc;
  }, {});

  const validationSchema = Yup.object(
    fieldsConfig.reduce((acc: any, field) => {
      if (field.validation) {
        acc[field.name] = field.validation;
      }
      return acc;
    }, {})
  );

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log('Form Submitted:', values);
    },
    ...formikProps,
  });

  console.log(formik);

  const formFields = fieldsConfig.reduce((acc: any, field: FieldConfig) => {
    const key = field.id || field.name;

    const fieldDefinitions = new FieldDefinitions(formik, field, editMode);

    const fieldDefinition = fieldDefinitions.fieldDefinitions[field.type];
    if (fieldDefinition) {
      acc[key] = fieldDefinition();
    } else {
      acc[key] = fieldDefinitions.fieldDefinitions.default();
    }

    // switch (field.type) {
    //   // case 'select':
    //   //   acc[key] = editMode ? (
    //   //     <TextField
    //   //       key={field.name}
    //   //       name={field.name}
    //   //       label={field.label}
    //   //       type={field.type}
    //   //       value={formik.values[field.name]}
    //   //       onChange={formik.handleChange}
    //   //       onBlur={formik.handleBlur}
    //   //       error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
    //   //       helperText={formik.touched[field.name] && formik.errors[field.name]}
    //   //       {...field.props}
    //   //     />
    //   //   ) : (
    //   //     DefaultTypography
    //   //   );
    //   //   break;
    //   case 'list': {
    //     // Helper functions to manage ingredient and instruction arrays
    //     const addLine = (field: string) => {
    //       formik.setFieldValue(field, [...formik.values[field], '']);
    //     };

    //     const deleteLine = (field: string, index: number) => {
    //       const newLines = [...formik.values[field]];
    //       newLines.splice(index, 1);
    //       formik.setFieldValue(field, newLines);
    //     };
    //     acc[key] = (
    //       <>
    //         <List dense>
    //           {formik.values[field.name]?.map((item: any, index: number) => (
    //             <ListItem key={index}>
    //               <ListItemText>
    //                 {editMode ? (
    //                   <TextField
    //                     fullWidth
    //                     margin="dense"
    //                     value={item}
    //                     onChange={(e) => {
    //                       const newItems = [...formik.values[field.name]];
    //                       newItems[index] = e.target.value;
    //                       formik.setFieldValue(field.name, newItems);
    //                     }}
    //                   />
    //                 ) : (
    //                   <Typography variant="body2">{item}</Typography>
    //                 )}
    //               </ListItemText>
    //               {editMode && (
    //                 <ListItemSecondaryAction>
    //                   <IconButton
    //                     edge="end"
    //                     onClick={() => deleteLine(field.name, index)}
    //                   >
    //                     <DeleteIcon />
    //                   </IconButton>
    //                 </ListItemSecondaryAction>
    //               )}
    //             </ListItem>
    //           ))}
    //         </List>
    //         {editMode && (
    //           <Button
    //             onClick={() => addLine(field.name)}
    //             fullWidth
    //             variant="outlined"
    //             style={{ marginBottom: '10px' }}
    //           >
    //             Add {field.label}
    //           </Button>
    //         )}
    //       </>
    //     );
    //     break;
    //   }
    //   default:
    //     acc[key] = editMode ? (
    //       <TextField
    //         key={field.name}
    //         margin="dense"
    //         name={field.name}
    //         label={field.label}
    //         type={field.type}
    //         value={formik.values[field.name]}
    //         onChange={formik.handleChange}
    //         onBlur={formik.handleBlur}
    //         error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
    //         helperText={formik.touched[field.name] && formik.errors[field.name]}
    //         {...field.props}
    //       />
    //     ) : (
    //       DefaultTypography
    //     );
    //     break;
    // }

    return acc;
  }, {});

  return { formFields, formik, save: formik.handleSubmit };
};

export default useFormFields;
