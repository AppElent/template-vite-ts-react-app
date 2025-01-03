import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import PropTypes from 'prop-types';
import * as React from 'react';
import Header from './Header';
import Navigator from './Navigator';
//import { OPTIONS } from '../../App';
import theme from '@/theme/paperbase/theme';

function Copyright() {
  return (
    <Typography
      variant="body2"
      align="center"
      sx={{ color: 'text.secondary' }}
    >
      {'Copyright © '}
      <Link
        color="inherit"
        href="https://appelent.site/"
      >
        AppElent
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

// let theme = createTheme({
//   palette: {
//     primary: {
//       light: '#63ccff',
//       main: '#009be5',
//       dark: '#006db3',
//     },
//   },
//   typography: {
//     h5: {
//       fontWeight: 500,
//       fontSize: 26,
//       letterSpacing: 0.5,
//     },
//   },
//   shape: {
//     borderRadius: 8,
//   },
//   components: {
//     MuiTab: {
//       defaultProps: {
//         disableRipple: true,
//       },
//     },
//   },
//   mixins: {
//     toolbar: {
//       minHeight: 48,
//     },
//   },
// });

// theme = {
//   ...theme,
//   components: {
//     MuiDrawer: {
//       styleOverrides: {
//         paper: {
//           backgroundColor: '#081627',
//         },
//       },
//     },
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: 'none',
//         },
//         contained: {
//           boxShadow: 'none',
//           '&:active': {
//             boxShadow: 'none',
//           },
//         },
//       },
//     },
//     MuiTabs: {
//       styleOverrides: {
//         root: {
//           marginLeft: theme.spacing(1),
//         },
//         indicator: {
//           height: 3,
//           borderTopLeftRadius: 3,
//           borderTopRightRadius: 3,
//           backgroundColor: theme.palette.common.white,
//         },
//       },
//     },
//     MuiTab: {
//       styleOverrides: {
//         root: {
//           textTransform: 'none',
//           margin: '0 16px',
//           minWidth: 0,
//           padding: 0,
//           [theme.breakpoints.up('md')]: {
//             padding: 0,
//             minWidth: 0,
//           },
//         },
//       },
//     },
//     MuiIconButton: {
//       styleOverrides: {
//         root: {
//           padding: theme.spacing(1),
//         },
//       },
//     },
//     MuiTooltip: {
//       styleOverrides: {
//         tooltip: {
//           borderRadius: 4,
//         },
//       },
//     },
//     MuiDivider: {
//       styleOverrides: {
//         root: {
//           backgroundColor: 'rgb(255,255,255,0.15)',
//         },
//       },
//     },
//     MuiListItemButton: {
//       styleOverrides: {
//         root: {
//           '&.Mui-selected': {
//             color: '#4fc3f7',
//           },
//         },
//       },
//     },
//     MuiListItemText: {
//       styleOverrides: {
//         primary: {
//           fontSize: 14,
//           fontWeight: theme.typography.fontWeightMedium,
//         },
//       },
//     },
//     MuiListItemIcon: {
//       styleOverrides: {
//         root: {
//           color: 'inherit',
//           minWidth: 'auto',
//           marginRight: theme.spacing(2),
//           '& svg': {
//             fontSize: 20,
//           },
//         },
//       },
//     },
//     MuiAvatar: {
//       styleOverrides: {
//         root: {
//           width: 32,
//           height: 32,
//         },
//       },
//     },
//   },
// };

const drawerWidth = 256;

export default function Paperbase({ children }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    // <ThemeProvider theme={theme}>
    <Box sx={{ display: 'flex', minHeight: '100vh', minWidth: '100vw' }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {isSmUp ? null : (
          <Navigator
            PaperProps={{ style: { width: drawerWidth } }}
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            closeDrawer={handleDrawerToggle}
          />
        )}
        <Navigator
          PaperProps={{ style: { width: drawerWidth } }}
          sx={{ display: { sm: 'block', xs: 'none' } }}
        />
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header onDrawerToggle={handleDrawerToggle} />
        <Box
          component="main"
          sx={{ flex: 1, py: 0, px: 0, bgcolor: '#eaeff1' }}
        >
          {children}
        </Box>
        <Box
          component="footer"
          sx={{ p: 2, bgcolor: '#eaeff1' }}
        >
          <Copyright />
        </Box>
      </Box>
    </Box>
    // </ThemeProvider>
  );
}

Paperbase.propTypes = {
  children: PropTypes.any,
};
