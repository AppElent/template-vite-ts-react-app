import { useFormButton } from '@/libs/forms';
import { ButtonProps, Button as DefaultButton } from '@mui/material';
import _ from 'lodash';

const SubmitButton = (props: ButtonProps) => {
  const { formik, options } = useFormButton();
  const { onClick } = props;

  const newProps = _.merge({}, options, props);

  const disabled = formik.isSubmitting || !formik.isValid || !formik.dirty;

  return (
    <DefaultButton
      //type="submit"
      color="primary"
      variant="contained"
      disabled={disabled}
      onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        formik.handleSubmit();
        if (onClick) onClick(e);
      }}
      // onSubmit={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      //   formik.handleSubmit();
      //   if (onClick) onClick(e);
      // }}
      {...newProps.muiButtonProps}
    >
      {props.children || 'Submit'}
    </DefaultButton>
  );
};

export default SubmitButton;
