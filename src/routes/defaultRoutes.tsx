import { RouteObject } from 'react-router-dom';
import SignIn from '@/pages/default/SignIn';

const defaultRoutes: RouteObject[] = [
  {
    path: '/',
    element: <div>Index</div>,
  },
  {
    path: 'terms',
    element: <div>Terms and conditions</div>,
  },
  {
    path: 'privacy',
    element: <div>Privacy</div>,
  },
  {
    path: 'login',
    element: <SignIn mode="signin" />,
  },
  {
    path: 'signup',
    element: <SignIn mode="signup" />,
  },
];

export default defaultRoutes;
