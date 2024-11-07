import PeopleIcon from '@mui/icons-material/People';

const menu = [
  // {
  //   id: 'Recipe library',
  //   children: [
  //     {
  //       id: 'Recipes',
  //       icon: <AssignmentRoundedIcon />,
  //       href: '/app/recipes',
  //     },
  //   ],
  // },
  {
    id: 'Settings',
    children: [
      { id: 'Profile', icon: <PeopleIcon />, href: '/app/profile' },
      { id: 'Settings', icon: <PeopleIcon />, href: '/app/settings' },
      { id: 'Account', icon: <PeopleIcon />, href: '/app/account' },
    ],
  },
];

// get debug value from local storage
const debug = localStorage.getItem('debug');

if (!menu.find((item) => item.id === 'Test pages') && (import.meta.env.DEV || debug === 'true'))
  menu.push({
    id: 'Test pages',
    children: [
      {
        id: 'Test data-sources',
        icon: <PeopleIcon />,
        href: '/app/test/data-sources',
      },
      {
        id: 'File uploads',
        icon: <PeopleIcon />,
        href: '/app/test/file-uploads',
      },
      {
        id: 'Auth providers',
        icon: <PeopleIcon />,
        href: '/app/test/auth-providers',
      },
    ],
  });

export default menu;
