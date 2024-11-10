import { Suspense } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

import AuthGuard from '@/guards/auth-guard';
import PaperbaseLayout from '@/layouts/paperbase/Layout';
import RecipeOverviewPage from '@/pages/recipe-overview-page';
import appRoutes from '@/routes/appRoutes';
import defaultRoutes from '@/routes/defaultRoutes';

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
        element: <RecipeOverviewPage />,
      },
      ...appRoutes,
    ],
  },
  ...defaultRoutes,
];

console.log(routes);

export default routes;
