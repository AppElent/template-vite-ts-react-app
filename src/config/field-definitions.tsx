import { FieldDefinitionConfig, RenderFieldDefinitions } from '@/libs/forms';
import { DefaultTextField } from '@/libs/forms/default-fields';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

const FieldDefinitions: RenderFieldDefinitions = {
  list: ({ field, formik, options, helpers }: FieldDefinitionConfig): any => {
    const hasItems = helpers.value?.length > 0;
    return (
      <>
        {options?.header && (hasItems || options?.editMode) && (
          <Stack
            direction="row"
            alignItems={'flex-end'}
          >
            {options?.editMode && (
              <IconButton
                onClick={() => helpers?.add()}
                style={{ marginLeft: '8px' }}
                color="primary"
              >
                <AddIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              //sx={{ mt: 2 }}
            >
              {field.label}
            </Typography>
          </Stack>
        )}
        {hasItems && (
          <List dense>
            {helpers.value?.map((item: any, index: number) => (
              <ListItem key={index}>
                <ListItemText style={{ margin: 0 }}>
                  {options?.editMode ? (
                    <TextField
                      fullWidth
                      margin="dense"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...helpers.value];
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
                      onClick={() => helpers?.remove(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </>
    );
  },
  object: ({ field, formik, options, helpers }: FieldDefinitionConfig): any => {
    console.log(helpers.value);
    return (
      <DefaultTextField
        field={field}
        formik={formik}
        options={options}
        helpers={helpers}
      />
    );
  },
};

export default FieldDefinitions;
