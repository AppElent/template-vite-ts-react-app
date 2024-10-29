import { FieldConfig } from '@/hooks/use-form-fields';
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
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { FormikProps } from 'formik';

interface FieldDefinition {
  [name: string]: () => React.ReactNode;
}

export default class FieldDefinitions {
  formik: FormikProps<any>;
  field: FieldConfig;
  editMode?: boolean;

  constructor(formik: FormikProps<any>, field: FieldConfig, editMode?: boolean) {
    this.formik = formik;
    this.field = field;
    this.editMode = editMode;
  }

  getDefaultTypography(formik: FormikProps<any>, field: FieldConfig) {
    return (
      <Typography
        key={field.name}
        variant="body1"
        margin="normal"
      >
        {field.label}: {formik.values[field.name]}
      </Typography>
    );
  }

  fieldDefinitions: FieldDefinition = {
    default: () =>
      this.editMode ? (
        <TextField
          key={this.field.name}
          margin="dense"
          name={this.field.name}
          label={this.field.label}
          type={this.field.type}
          value={this.formik.values[this.field.name]}
          onChange={this.formik.handleChange}
          onBlur={this.formik.handleBlur}
          error={
            this.formik.touched[this.field.name] && Boolean(this.formik.errors[this.field.name])
          }
          helperText={this.formik.touched[this.field.name] && this.formik.errors[this.field.name]}
          {...this.field.props}
        />
      ) : (
        this.getDefaultTypography(this.formik, this.field)
      ),
    list: () => {
      // Helper functions to manage ingredient and instruction arrays
      const addLine = (field: string) => {
        this.formik.setFieldValue(field, [...this.formik.values[field], '']);
      };

      const deleteLine = (field: string, index: number) => {
        const newLines = [...this.formik.values[field]];
        newLines.splice(index, 1);
        this.formik.setFieldValue(field, newLines);
      };
      return (
        <>
          <List dense>
            {this.formik.values[this.field.name]?.map((item: any, index: number) => (
              <ListItem key={index}>
                <ListItemText>
                  {this.editMode ? (
                    <TextField
                      fullWidth
                      margin="dense"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...this.formik.values[this.field.name]];
                        newItems[index] = e.target.value;
                        this.formik.setFieldValue(this.field.name, newItems);
                      }}
                    />
                  ) : (
                    <Typography variant="body2">{item}</Typography>
                  )}
                </ListItemText>
                {this.editMode && (
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => deleteLine(this.field.name, index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>
          {this.editMode && (
            <Button
              onClick={() => addLine(this.field.name)}
              fullWidth
              variant="outlined"
              style={{ marginBottom: '10px' }}
            >
              Add {this.field.label}
            </Button>
          )}
        </>
      );
    },
  };
}
