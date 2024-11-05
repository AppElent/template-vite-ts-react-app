import { Suspense } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

import Account from '@/pages/default/Account';
import Settings from '@/pages/default/Settings';
import DataSources from '@/pages/default/test/data-sources';
import FileUploads from '@/pages/default/test/file-uploads';

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
        path: 'file-uploads',
        element: <FileUploads />,
      },
    ],
  },
];

export default appRoutes;
