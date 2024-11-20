import { Suspense } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

import Account from '@/pages/default/account';
import Settings from '@/pages/default/Settings';
import TestAuthProviders from '@/pages/default/test/auth-providers';
import DataSources from '@/pages/default/test/data-sources';
import DataSources2 from '@/pages/default/test/data-sources/index2';
import FileUploads from '@/pages/default/test/file-uploads';
import Forms from '@/pages/default/test/forms';

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
    ],
  },
];

export default appRoutes;
