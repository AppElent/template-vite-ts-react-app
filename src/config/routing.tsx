import appRoutes from '@/routes/appRoutes';
import { Home as HomeIcon } from '@mui/icons-material';
import { JSX } from 'react';
import { RouteObject } from 'react-router-dom';

export type CustomRouteObject = RouteObject & {
  id: string;
  label: string;
  Icon: JSX.Element;
  translationKey?: string;
  category?: string;
  loginRequired?: boolean;
  children?: CustomRouteObject[] | any;
};

export const routes: CustomRouteObject[] = [
  {
    id: 'home',
    label: 'Home',
    Icon: <HomeIcon fontSize="inherit" />,
    path: 'app',
    children: [
      {
        id: 'homeIndex',
        index: true,
      },
      ...appRoutes,
    ],
  },
  //   ...defaultRoutes,
];

export const paths = getAllPaths(routes);

// Function to create a flat list of all paths with custom properties
function getAllPaths(routes: CustomRouteObject[], parentPath: string = ''): any[] {
  return routes.flatMap((route) => {
    const currentPath = route.path
      ? `${parentPath}/${route.path}`.replace(/\/+/g, '/')
      : parentPath;
    const { children, ...routeInfo } = route;
    const currentRoute = { ...routeInfo, to: currentPath };
    const childrenPaths = children ? getAllPaths(children, currentPath) : [];
    return [currentRoute, ...childrenPaths];
  });
}

export default routes;
