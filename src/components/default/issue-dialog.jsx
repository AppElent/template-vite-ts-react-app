import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

const IssueSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required')
});

const IssueDialog = ({ open, onClose, onSave }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Submit an Issue</DialogTitle>
      <Formik
        initialValues={{ title: '', description: '' }}
        validationSchema={IssueSchema}
        onSubmit={(values, { setSubmitting }) => {
          onSave(values);
          setSubmitting(false);
          onClose();
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                name="title"
                label="Title"
                fullWidth
                margin="normal"
                error={touched.title && !!errors.title}
                helperText={touched.title && errors.title}
              />
              <Field
                as={TextField}
                name="description"
                label="Description"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                error={touched.description && !!errors.description}
                helperText={touched.description && errors.description}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                Submit
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

IssueDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
};

export default IssueDialog;