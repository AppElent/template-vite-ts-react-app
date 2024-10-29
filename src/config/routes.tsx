import { Suspense } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

import defaultRoutes from '@/routes/defaultRoutes';
import appRoutes from '@/routes/appRoutes';
import AuthGuard from '@/guards/auth-guard';
import PaperbaseLayout from '@/layouts/paperbase/Layout';
import RecipeOverviewPage from '@/pages/recipe-overview-page';

const LayoutSettings = {
  navigation: {},
  notifications: {
    list: () => {},
    add: () => {},
    delete: () => {},
  },
};

const routes: RouteObject[] = [
  {
    path: 'app',
    element: (
      <AuthGuard>
        <PaperbaseLayout settings={LayoutSettings}>
          <Suspense>
            <Outlet />
          </Suspense>
        </PaperbaseLayout>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <div></div>,
      },
      {
        path: 'recipes',
        element: <RecipeOverviewPage />,
      },
      ...appRoutes,
    ],
  },
  ...defaultRoutes,
];

export default routes;
