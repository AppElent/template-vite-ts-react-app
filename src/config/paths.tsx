import config from '.';
import { paths } from './routing';

export interface PathItem {
  id: string;
  label: string;
  translationKey?: string;
  to?: string;
  Icon: React.ReactNode;
  category?: string;
}

const debug = config.settings?.logLevel === 'debug';

// TODO: fix
interface MenuCategory {
  id: string;
  label: string;
  translationKey?: string;
  showInMenu?: boolean | (() => boolean);
}

const menuCategories: MenuCategory[] = [
  {
    id: 'recipes',
    label: 'Recipes',
    translationKey: 'foodhub:menu.recipes',
  },
  {
    id: 'settings',
    label: 'Settings',
    translationKey: 'common:menu.settings',
  },
  {
    id: 'test',
    label: 'Test pages',
    showInMenu: debug,
  },
  {
    id: 'satisfactory',
    label: 'Satisfactory',
  },
];

console.log(paths);

// export const paths2: PathItem[] = [
//   {
//     id: 'home',
//     label: 'Home',
//     to: '/app',
//     Icon: <HomeIcon fontSize="inherit" />,
//   },
//   {
//     id: 'recipes',
//     label: 'Recipes',
//     translationKey: 'foodhub:menu.recipes',
//     to: '/app/recipes',
//     Icon: <FlatwareIcon fontSize="inherit" />,
//     category: 'recipes',
//   },
//   {
//     id: 'myrecipes',
//     label: 'My Recipes',
//     translationKey: 'foodhub:menu.myRecipes',
//     to: '/app/recipes/my',
//     Icon: <FlatwareIcon fontSize="inherit" />,
//     category: 'recipes',
//   },
//   {
//     id: 'recipe-details',
//     label: 'Recipe Details',
//     to: '/app/recipes/:id',
//     Icon: <FlatwareIcon fontSize="inherit" />,
//   },
//   {
//     id: 'account',
//     label: 'Account',
//     to: '/app/account',
//     Icon: <PeopleIcon fontSize="inherit" />,
//     category: 'settings',
//   },
//   {
//     id: 'test-pages',
//     label: 'Test pages',
//     Icon: <QuizIcon />,
//     to: '/app/test',
//   },
//   {
//     id: 'test-data-sources',
//     label: 'Test data-sources',
//     Icon: <QuizIcon />,
//     to: '/app/test/data-sources',
//     category: 'test',
//   },
//   {
//     id: 'file-uploads',
//     label: 'File uploads',
//     Icon: <QuizIcon />,
//     to: '/app/test/file-uploads',
//     category: 'test',
//   },
//   {
//     id: 'auth-providers',
//     label: 'Auth providers',
//     Icon: <QuizIcon />,
//     to: '/app/test/auth-providers',
//     category: 'test',
//   },
//   {
//     id: 'forms',
//     label: 'Forms',
//     Icon: <QuizIcon />,
//     to: '/app/test/forms',
//     category: 'test',
//   },
//   {
//     id: 'login',
//     label: 'Login',
//     Icon: <QuizIcon />,
//     to: '/app/login',
//   },
//   {
//     id: 'signup',
//     label: 'Signup',
//     Icon: <QuizIcon />,
//     to: '/app/signup',
//   },
//   {
//     id: '404',
//     label: '404',
//     Icon: <QuizIcon />,
//     to: '/404',
//   },
// ];

// console.log(paths);
// const routeobject = generateRouteObjects(routes);
// console.log(routeobject);

export const getPath = (id: string) => paths.find((path) => path.id === id);

const generateMenu = () => {
  const menu = menuCategories
    .filter(
      (c) =>
        c.showInMenu === undefined ||
        (typeof c.showInMenu === 'boolean' ? c.showInMenu : c.showInMenu())
    )
    .map((category) => {
      const items = paths.filter((path) => path.category === category.id);

      return {
        id: category.id,
        label: category.label,
        translationKey: category.translationKey,
        children: items.map((item) => ({
          id: item.id,
          label: item.label,
          translationKey: item.translationKey,
          Icon: item.Icon,
          to: item.to,
        })),
      };
    });

  return menu;
};

export const menu = generateMenu();

export default paths;
