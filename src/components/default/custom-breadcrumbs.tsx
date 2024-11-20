import { Box, Breadcrumbs, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { PathItem, paths } from '@/config/paths';

import { matchPath } from 'react-router-dom';

const generateBreadcrumbs = (breadcrumbsConfig: PathItem[], pathname: string) => {
  const breadcrumbs: PathItem[] = [];
  let accumulatedPath = '';

  // Split the current pathname into segments
  const segments = pathname.split('/').filter(Boolean);

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
  const items = generateBreadcrumbs(paths, window.location.pathname);

  // If currentPage is set, replace the last item with it
  if (currentPage) {
    items[items.length - 1].label = currentPage;
  }

  return (
    <>
      {items.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb">
            {items.map((item, index) =>
              item.to ? (
                <Stack
                  direction="row"
                  alignItems="center"
                  key={index}
                >
                  <Box sx={{ mr: 0.5 }}>{item.Icon && item.Icon}</Box>
                  <Box>
                    <Link
                      key={index}
                      component={RouterLink}
                      to={item.to}
                      //underline="hover"
                      color="inherit"
                    >
                      {item.label}
                    </Link>
                  </Box>
                </Stack>
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
