import { Suspense } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

import PaperbaseLayout from '@/layouts/paperbase/Layout';
import NotFound from '@/pages/default/404';
import SignIn from '@/pages/default/SignIn';
import TestAuthProviders from '@/pages/default/test/auth-providers';
import DataSources from '@/pages/default/test/data-sources/index';
import FileUploads from '@/pages/default/test/file-uploads';
import Forms from '@/pages/default/test/forms';
import Translations from '@/pages/default/test/translations';
import HomePage from '@/pages/home';
import MyRecipeOverviewPage from '@/pages/recipes/my-recipe-overview';
import RecipeDetailsPage from '@/pages/recipes/recipe-details';
import RecipeOverviewPage from '@/pages/recipes/recipe-overview';
import Test from '@/pages/satisfactory/test';
import { CustomRouteObject, routes as routesImport } from './routing';
// import HomePage from '@/pages/home';
// import MyRecipeOverviewPage from '@/pages/recipes/my-recipe-overview';
// import RecipeDetailsPage from '@/pages/recipes/recipe-details';
// import RecipeOverviewPage from '@/pages/recipes/recipe-overview';
// import appRoutes from '@/routes/appRoutes';
// import defaultRoutes from '@/routes/defaultRoutes';
//import { PathItem } from './paths';

// export type CustomRouteObject = RouteObject & {
//   id: string;
//   label: string;
//   Icon: JSX.Element;
//   translationKey?: string;
//   category?: string;
//   children?: CustomRouteObject[];
// };

// const routes: CustomRouteObject[] = [
//   {
//     id: 'home',
//     label: 'Home',
//     Icon: <HomeIcon fontSize="inherit" />,
//     path: 'app',
//     // element: (
//     //   // <AuthGuard options={{ shouldBeAuthenticated: true, login: '/login' }}>
//     //   <PaperbaseLayout settings={LayoutSettings}>
//     //     <Suspense>
//     //       <Outlet />
//     //     </Suspense>
//     //   </PaperbaseLayout>
//     //   // </AuthGuard>
//     // ),
//     children: [
//       {
//         index: true,
//         element: <HomePage />,
//       },
//       {
//         path: 'recipes',
//         element: <Outlet />,
//         children: [
//           {
//             index: true,
//             element: <RecipeOverviewPage />,
//           },
//           {
//             path: 'my',
//             element: <MyRecipeOverviewPage />,
//           },
//           {
//             path: ':id',
//             element: <RecipeDetailsPage />,
//           },
//         ],
//       },
//       // {
//       //   path: 'recipes/:id',
//       //   element: <RecipeDetailsPage />,
//       // },
//       ...appRoutes,
//     ],
//   },
//   ...defaultRoutes,
// ];

const routeElements: { [key: string]: JSX.Element } = {
  home: (
    <PaperbaseLayout>
      <Suspense>
        <Outlet />
      </Suspense>
    </PaperbaseLayout>
  ),
  // Recipe pages
  homeIndex: <HomePage />,
  recipesIndex: <RecipeOverviewPage />,
  myRecipes: <MyRecipeOverviewPage />,
  myRecipesIndex: <MyRecipeOverviewPage />,
  recipeDetails: <RecipeDetailsPage />,
  myRecipeDetails: <RecipeDetailsPage />,
  // Satisfactory pages
  satisfactoryIndex: <Test />,
  // Test pages
  testDataSources: <DataSources />,
  testFileUploads: <FileUploads />,
  testAuthProviders: <TestAuthProviders />,
  testForms: <Forms />,
  testTranslations: <Translations />,
  // Default pages
  login: <SignIn mode="signin" />,
  signup: <SignIn mode="signup" />,
  terms: <div>Terms</div>,
  privacy: <div>Privacy</div>,
  '404': <NotFound />,
};

function generateRouteObjects(routes: CustomRouteObject[]): RouteObject[] {
  return routes.map(
    ({
      id: _id,
      Icon: _Icon,
      translationKey: _translationKey,
      category: _category,
      children,
      ...route
    }) => {
      const routeObject: RouteObject = {
        ...route,
        element: route.element ? route.element : routeElements[_id],
      };
      if (children) {
        routeObject.children = generateRouteObjects(children);
      }
      return routeObject;
    }
  );
}

const routes = generateRouteObjects(routesImport);

// export const paths = getAllPaths(routes);
// console.log(paths);

// Function to create a flat list of all paths with custom properties
// export function getAllPaths(routes: CustomRouteObject[], parentPath: string = ''): any[] {
//   return routes.flatMap((route) => {
//     const currentPath = route.path
//       ? `${parentPath}/${route.path}`.replace(/\/+/g, '/')
//       : parentPath;
//     const { children, ...routeInfo } = route;
//     const currentRoute = { ...routeInfo, to: currentPath };
//     const childrenPaths = children ? getAllPaths(children, currentPath) : [];
//     return [currentRoute, ...childrenPaths];
//   });
// }

export default routes;
