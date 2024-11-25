import { Suspense } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

import { PathItem } from '@/config/paths';
import Account from '@/pages/default/account';
import Settings from '@/pages/default/Settings';
import SignIn from '@/pages/default/SignIn';
import TestAuthProviders from '@/pages/default/test/auth-providers';
import DataSources from '@/pages/default/test/data-sources';
import DataSources2 from '@/pages/default/test/data-sources/index2';
import FileUploads from '@/pages/default/test/file-uploads';
import Forms from '@/pages/default/test/forms';
import Translations from '@/pages/default/test/translations';

// export const appPaths: PathItem[] = [
//   {
//     id: 'account',
//     label: 'Account',
//     Icon: <></>,
//     to: '/app/account',
//     category: 'settings',
//   },
//   {
//     id: 'login',
//     label: 'Login',
//     Icon: <></>,
//     to: '/app/login',
//   },
//   {
//     id: 'signup',
//     label: 'Signup',
//     Icon: <></>,
//     to: '/app/signup',
//   },
// ];

// TODO: convert routeobject to paths

type CustomRouteObject = RouteObject & {
  id: string;
  label: string;
  translationKey?: string;
  category?: string;
};

export const generatePathsFromRoutes = (_routes: CustomRouteObject[]): PathItem[] => {
  return [];
};

const appRoutes: RouteObject[] = [
  {
    path: 'account',
    element: <Account />,
  },
  {
    path: 'settings',
    element: <Settings />,
  },
  {
    path: 'profile',
    element: <div></div>,
  },
  {
    path: 'test',
    element: (
      <Suspense>
        <Outlet />
      </Suspense>
    ),
    children: [
      { index: true, element: <div>Test pages</div> },
      {
        path: 'data-sources',
        element: <DataSources />,
      },
      {
        path: 'data-sources2',
        element: <DataSources2 />,
      },
      {
        path: 'file-uploads',
        element: <FileUploads />,
      },
      {
        path: 'auth-providers',
        element: <TestAuthProviders />,
      },
      {
        path: 'forms',
        element: <Forms />,
      },
      {
        path: 'translations',
        element: <Translations />,
      },
    ],
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

export default appRoutes;
