import { FieldDefinitionConfig, RenderFieldDefinitions } from '@/libs/forms';
import { DefaultTextField } from '@/libs/forms/default-fields';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Autocomplete,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Rating,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

// TODO: add fielddefinition for autocompelte chip tag thingy
// TODO: add fielddefinition for datepicker

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
                      // onChange={(e) => {
                      //   const newItems = [...helpers.value];
                      //   newItems[index] = e.target.value;
                      //   formik.setFieldValue(field.name, newItems);
                      // }}
                      onChange={helpers.handleChange}
                      onBlur={formik.handleBlur}
                      name={`${field.name}[${index}]`}
                      error={helpers.touched && Boolean(helpers.errors)}
                      helperText={helpers.touched && helpers.errors}
                      {...(options?.muiTextFieldProps && options.muiTextFieldProps)}
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
    return (
      <DefaultTextField
        field={field}
        formik={formik}
        options={options}
        helpers={helpers}
      />
    );
  },
  tag_list: ({ field, formik, options, helpers }: FieldDefinitionConfig): any => {
    return options?.editMode ? (
      <Autocomplete
        multiple
        freeSolo
        options={field.custom?.suggestions || []}
        value={helpers.value || []}
        onChange={(_event, newValue) => formik.setFieldValue(field.name, newValue)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
              key={option}
              onDelete={() => {
                const newKeywords = helpers.value.filter((keyword: string) => keyword !== option);
                formik.setFieldValue(field.name, newKeywords);
              }}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={field.label}
            placeholder={`Add a ${field.label}`}
            margin="dense"
          />
        )}
      />
    ) : (
      <Typography
        key={field.name}
        variant="body1"
        margin="normal"
        {...(options?.muiTypographyProps && options.muiTypographyProps)}
      >
        {field.label}: {helpers.value?.join(', ')}
      </Typography>
    );
  },
  rating: ({ field, formik, options, helpers }: FieldDefinitionConfig): any => {
    return (
      <Rating
        name={field.name}
        value={helpers.value || 0}
        onChange={(_event, newValue) => {
          formik.setFieldValue(field.name, newValue);
          if (!options?.editMode) {
            formik.handleSubmit();
          }
        }}
        precision={0.5}
        // icon={<FavoriteIcon fontSize="inherit" />}
        // emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
        {...(options?.muiRatingProps && options.muiRatingProps)}
      />
    );
  },
};

export default FieldDefinitions;
