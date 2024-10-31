import { FieldConfig } from '@/hooks/use-form-fields';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { FormikProps } from 'formik';

const DefaultTypography = ({ field, formik }: { field: FieldConfig; formik: FormikProps<any> }) => {
  return (
    <Typography
      key={field.name}
      variant="body1"
      margin="normal"
    >
      {field.label}: {formik.values[field.name]}
    </Typography>
  );
};

export interface FieldDefinitionConfig {
  field: FieldConfig;
  formik: FormikProps<any>;
  options: { [key: string]: any };
}

export interface FieldDefinition {
  [key: string]: (config: FieldDefinitionConfig) => any;
}

const FieldDefinitions: FieldDefinition = {
  text: ({ field, formik, options }: FieldDefinitionConfig): any =>
    options.editMode ? (
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
    ) : (
      <DefaultTypography
        field={field}
        formik={formik}
      />
    ),
  list: ({ field, formik, options }: FieldDefinitionConfig): any => {
    // Helper functions to manage ingredient and instruction arrays
    const addLine = (field: string) => {
      formik.setFieldValue(field, [...formik.values[field], '']);
    };

    const deleteLine = (field: string, index: number) => {
      const newLines = [...formik.values[field]];
      newLines.splice(index, 1);
      formik.setFieldValue(field, newLines);
    };

    const hasItems =
      formik.values[field.name]?.length > 0 &&
      formik.values[field.name][0] !== '' &&
      !options?.editMode;
    return (
      <>
        {options?.header && hasItems && (
          <Typography
            variant="h6"
            sx={{ mt: 2 }}
          >
            {field.label}
          </Typography>
        )}
        {hasItems && (
          <List dense>
            {formik.values[field.name]?.map((item: any, index: number) => (
              <ListItem key={index}>
                <ListItemText>
                  {options?.editMode ? (
                    <TextField
                      fullWidth
                      margin="dense"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...formik.values[field.name]];
                        newItems[index] = e.target.value;
                        formik.setFieldValue(field.name, newItems);
                      }}
                    />
                  ) : (
                    <Typography variant="body2">
                      {options?.numbered ? `${index + 1}. ` : ''} {item}
                    </Typography>
                  )}
                </ListItemText>
                {options?.editMode && (
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => deleteLine(field.name, index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>
        )}

        {options?.editMode && (
          <Button
            onClick={() => addLine(field.name)}
            fullWidth
            variant="outlined"
            style={{ marginBottom: '10px' }}
          >
            Add {field.label}
          </Button>
        )}
      </>
    );
  },
};

// export default class FieldDefinitions {
//   formik: FormikProps<any>;
//   field: FieldConfig;
//   editMode?: boolean;

//   constructor(formik: FormikProps<any>, field: FieldConfig, editMode?: boolean) {
//     this.formik = formik;
//     this.field = field;
//     this.editMode = editMode;
//   }

//   getDefaultTypography(formik: FormikProps<any>, field: FieldConfig) {
//     return (
//       <Typography
//         key={field.name}
//         variant="body1"
//         margin="normal"
//       >
//         {field.label}: {formik.values[field.name]}
//       </Typography>
//     );
//   }

//   fieldDefinitions: FieldDefinition = {
//     default: () =>
//       this.editMode ? (
//         <TextField
//           key={this.field.name}
//           margin="dense"
//           name={this.field.name}
//           label={this.field.label}
//           type={this.field.type}
//           value={this.formik.values[this.field.name]}
//           onChange={this.formik.handleChange}
//           onBlur={this.formik.handleBlur}
//           error={
//             this.formik.touched[this.field.name] && Boolean(this.formik.errors[this.field.name])
//           }
//           helperText={this.formik.touched[this.field.name] && this.formik.errors[this.field.name]}
//           {...this.field.props}
//         />
//       ) : (
//         this.getDefaultTypography(this.formik, this.field)
//       ),
//     list: () => {
//       // Helper functions to manage ingredient and instruction arrays
//       const addLine = (field: string) => {
//         this.formik.setFieldValue(field, [...this.formik.values[field], '']);
//       };

//       const deleteLine = (field: string, index: number) => {
//         const newLines = [...this.formik.values[field]];
//         newLines.splice(index, 1);
//         this.formik.setFieldValue(field, newLines);
//       };
//       return (
//         <>
//           <Typography
//             variant="h6"
//             sx={{ mt: 2 }}
//           >
//             {this.field.label}
//           </Typography>
//           <List dense>
//             {this.formik.values[this.field.name]?.map((item: any, index: number) => (
//               <ListItem key={index}>
//                 <ListItemText>
//                   {this.editMode ? (
//                     <TextField
//                       fullWidth
//                       margin="dense"
//                       value={item}
//                       onChange={(e) => {
//                         const newItems = [...this.formik.values[this.field.name]];
//                         newItems[index] = e.target.value;
//                         this.formik.setFieldValue(this.field.name, newItems);
//                       }}
//                     />
//                   ) : (
//                     <Typography variant="body2">
//                       {index + 1}. {item}
//                     </Typography>
//                   )}
//                 </ListItemText>
//                 {this.editMode && (
//                   <ListItemSecondaryAction>
//                     <IconButton
//                       edge="end"
//                       onClick={() => deleteLine(this.field.name, index)}
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </ListItemSecondaryAction>
//                 )}
//               </ListItem>
//             ))}
//           </List>
//           {this.editMode && (
//             <Button
//               onClick={() => addLine(this.field.name)}
//               fullWidth
//               variant="outlined"
//               style={{ marginBottom: '10px' }}
//             >
//               Add {this.field.label}
//             </Button>
//           )}
//         </>
//       );
//     },
//   };
// }

export default FieldDefinitions;
