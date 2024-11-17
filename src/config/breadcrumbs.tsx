import { Book as BookIcon, Home as HomeIcon } from '@mui/icons-material';

export interface BreadcrumbItem {
  label: string;
  to?: string; // Optional for the last breadcrumb
  Icon: React.ReactNode;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    label: 'Home',
    to: '/app',
    Icon: (
      <HomeIcon
        sx={{ mr: 0.5 }}
        fontSize="inherit"
      />
    ),
  },
  {
    label: 'Recipes',
    to: '/app/recipes',
    Icon: (
      <BookIcon
        sx={{ mr: 0.5 }}
        fontSize="inherit"
      />
    ),
  },
  {
    label: 'Recipe Details',
    to: '/app/recipes/:id',
    Icon: (
      <BookIcon
        sx={{ mr: 0.5 }}
        fontSize="inherit"
      />
    ),
  },
];

export default breadcrumbs;
