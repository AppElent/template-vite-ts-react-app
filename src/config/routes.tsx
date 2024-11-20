import { Suspense } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

import PaperbaseLayout from '@/layouts/paperbase/Layout';
import HomePage from '@/pages/home';
import RecipeDetailsPage from '@/pages/recipes/recipe-details';
import RecipeOverviewPage from '@/pages/recipes/recipe-overview';
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
      // <AuthGuard options={{ shouldBeAuthenticated: true, login: '/login' }}>
      <PaperbaseLayout settings={LayoutSettings}>
        <Suspense>
          <Outlet />
        </Suspense>
      </PaperbaseLayout>
      // </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'recipes',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <RecipeOverviewPage />,
          },
          {
            path: ':id',
            element: <RecipeDetailsPage />,
          },
        ],
      },
      // {
      //   path: 'recipes/:id',
      //   element: <RecipeDetailsPage />,
      // },
      ...appRoutes,
    ],
  },
  ...defaultRoutes,
];

export default routes;
