import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import breadcrumbs, { BreadcrumbItem } from '@/config/breadcrumbs';

import { matchPath } from 'react-router-dom';

const generateBreadcrumbs = (breadcrumbsConfig: BreadcrumbItem[], pathname: string) => {
  const breadcrumbs: BreadcrumbItem[] = [];
  let accumulatedPath = '';

  // Split the current pathname into segments
  const segments = pathname.split('/').filter(Boolean);
  console.log(breadcrumbsConfig, breadcrumbs, segments, pathname);

  for (const segment of segments) {
    accumulatedPath += `/${segment}`;

    // Match the current accumulated path to a route
    const matchedRoute = breadcrumbsConfig.find((route) =>
      matchPath(route.to || '', accumulatedPath)
    );

    if (matchedRoute) {
      breadcrumbs.push({ ...matchedRoute });
    }
  }

  // The last breadcrumb should not be clickable
  if (breadcrumbs.length > 0) {
    breadcrumbs[breadcrumbs.length - 1].to = undefined;
  }

  return breadcrumbs;
};

const CustomBreadcrumbs = ({ currentPage }: { currentPage?: string }) => {
  const items = generateBreadcrumbs(breadcrumbs, window.location.pathname);
  console.log(items);

  // If currentPage is set, replace the last item with it
  if (currentPage) {
    items[items.length - 1].label = currentPage;
  }

  return (
    <>
      {items.length > 1 && (
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb">
            {items.map((item, index) =>
              item.to ? (
                <Link
                  key={index}
                  component={RouterLink}
                  to={item.to}
                  //underline="hover"
                  color="inherit"
                >
                  {item.Icon && item.Icon}
                  {item.label}
                </Link>
              ) : (
                <Typography
                  key={index}
                  color="textPrimary"
                >
                  {/* {item.Icon && item.Icon} */}
                  {item.label}
                </Typography>
              )
            )}
          </Breadcrumbs>
        </Box>
      )}
    </>
  );
};

export default CustomBreadcrumbs;
