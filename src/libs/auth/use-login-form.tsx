import { FacebookIcon, GoogleIcon } from '@/components/default/auth/CustomIcons';
import { ButtonProps, TextFieldProps } from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

interface FormValues {
  email: string;
  password: string;
  confirmPassword?: string;
  submit?: string;
}

interface AuthProvider {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  getDemoUser: () => { username: string; password: string };
}

interface ButtonWithText extends ButtonProps {
  text: string;
}

interface UseLoginFormReturn {
  authProvider: AuthProvider;
  formik: any;
  fields: {
    email: TextFieldProps;
    password: TextFieldProps;
    confirmPassword?: TextFieldProps;
  };
  buttons: {
    toggleMode: ButtonWithText;
    login: ButtonWithText;
    loginDemoUser: ButtonWithText;
    google: ButtonWithText;
    facebook: ButtonWithText;
  };
  error?: string;
}

const useLoginForm = (
  authProvider: AuthProvider,
  mode: 'signin' | 'signup'
): UseLoginFormReturn => {
  const [isSignUpMode, setIsSignUpMode] = useState(mode === 'signup');

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
    ...(isSignUpMode && {
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
        .required('Required'),
    }),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values: any, { setSubmitting, setErrors }: FormikHelpers<FormValues>) => {
      setSubmitting(true);
      try {
        if (isSignUpMode) {
          await authProvider.signUp(values.email, values.password);
        } else {
          await authProvider.signIn(values.email, values.password);
        }
      } catch (err: any) {
        setErrors({ submit: err.message });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const disabled = formik.isSubmitting || !formik.dirty || !formik.isValid;

  return {
    authProvider,
    formik,
    fields: {
      email: {
        id: 'email',
        name: 'email',
        label: 'Email',
        value: formik.values.email,
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        error: formik.touched.email && Boolean(formik.errors.email),
        helperText: formik.touched.email && formik.errors.email,
      },
      password: {
        id: 'password',
        name: 'password',
        label: 'Password',
        type: 'password',
        value: formik.values.password,
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        error: formik.touched.password && Boolean(formik.errors.password),
        helperText: formik.touched.password && formik.errors.password,
      },

      confirmPassword: {
        id: 'confirmPassword',
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        value: formik.values.confirmPassword,
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        error: formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword),
        helperText: formik.touched.confirmPassword && formik.errors.confirmPassword,
      },
    },
    buttons: {
      toggleMode: {
        text: isSignUpMode ? 'Switch to Sign Up' : 'Switch to Login',
        onClick: () => setIsSignUpMode(!isSignUpMode),
      },
      login: {
        text: isSignUpMode ? 'Sign Up' : 'Login',
        onClick: () => formik.handleSubmit,
        disabled: disabled,
      },
      loginDemoUser: {
        text: 'Login as Demo User',
        onClick: () =>
          authProvider.signIn(
            authProvider.getDemoUser().username,
            authProvider.getDemoUser().password
          ),
      },
      google: {
        text: 'Login with Google',
        onClick: () => console.log('Login with Google'),
        startIcon: <GoogleIcon />,
      },
      facebook: {
        text: 'Login with Facebook',
        onClick: () => console.log('Login with Facebook'),
        startIcon: <FacebookIcon />,
      },
    },
    error: formik.errors.submit,
  };
};

export default useLoginForm;
