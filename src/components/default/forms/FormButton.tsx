import { useFormButton } from '@/libs/forms';
import { ButtonProps, Button as DefaultButton } from '@mui/material';
import _ from 'lodash';

const FormButton = (props: ButtonProps) => {
  const { formik, options } = useFormButton();

  const newProps = _.merge({}, options, props);

  const disabled = formik.isSubmitting || !formik.isValid || !formik.dirty;

  return (
    <DefaultButton
      type="submit"
      color="primary"
      variant="contained"
      disabled={disabled}
      onSubmit={formik.handleSubmit}
      {...newProps.muiButtonProps}
    >
      Submit
    </DefaultButton>
  );
};

export default FormButton;
