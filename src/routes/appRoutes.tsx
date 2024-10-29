import { Suspense } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

import DataSources from '@/pages/default/test/data-sources';
import Account from '@/pages/default/Account';

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
    ],
  },
];

export default appRoutes;
