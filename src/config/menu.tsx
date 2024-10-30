import PeopleIcon from '@mui/icons-material/People';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';

const menu = [
  {
    id: 'Recipe library',
    children: [
      {
        id: 'Recipes',
        icon: <AssignmentRoundedIcon />,
        href: '/app/recipes',
      },
    ],
  },
  {
    id: 'Settings',
    children: [
      { id: 'Profile', icon: <PeopleIcon />, href: '/app/profile' },
      { id: 'Settings', icon: <PeopleIcon />, href: '/app/settings' },
      { id: 'Account', icon: <PeopleIcon />, href: '/app/account' },
    ],
  },
];

if (!menu.find((item) => item.id === 'Test pages') && import.meta.env.DEV)
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
    ],
  });

export default menu;
