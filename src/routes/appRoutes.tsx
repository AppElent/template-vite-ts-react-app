import { Suspense } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

import DataSources from '@/pages/default/test/data-sources';
import Account from '@/pages/default/Account';
import FileUploads from '@/pages/default/test/file-uploads';

const appRoutes: RouteObject[] = [
  {
    path: 'account',
    element: <Account />,
  },
  {
    path: 'settings',
    element: <div></div>,
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
