import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup';
import PermMediaOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActual';
import PublicIcon from '@mui/icons-material/Public';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import TimerIcon from '@mui/icons-material/Timer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

//import { OPTIONS } from '../../App';
import config from '@/config';
import menu from '@/config/menu';
import useRouter from '@/hooks/use-router';

const categories = [
  {
    id: 'Build',
    children: [
      {
        id: 'Authentication',
        icon: <PeopleIcon />,
        active: true,
      },
      { id: 'Database', icon: <DnsRoundedIcon /> },
      { id: 'Storage', icon: <PermMediaOutlinedIcon /> },
      { id: 'Hosting', icon: <PublicIcon /> },
      { id: 'Functions', icon: <SettingsEthernetIcon /> },
      {
        id: 'Machine learning',
        icon: <SettingsInputComponentIcon />,
      },
    ],
  },
  {
    id: 'Quality',
    children: [
      { id: 'Analytics', icon: <SettingsIcon /> },
      { id: 'Performance', icon: <TimerIcon /> },
      { id: 'Test Lab', icon: <PhonelinkSetupIcon /> },
    ],
  },
];

const item = {
  py: '2px',
  px: 3,
  color: 'rgba(255, 255, 255, 0.7)',
  '&:hover, &:focus': {
    bgcolor: 'rgba(255, 255, 255, 0.08)',
  },
};

const itemCategory = {
  boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
  py: 1.5,
  px: 3,
};

export default function Navigator(props) {
  const { closeDrawer, ...other } = props;
  const router = useRouter();
  const mainItems = menu || categories;
  const title = config?.meta?.title;

  const onLinkClick = (href) => {
    router.push(href);
    if (closeDrawer) {
      closeDrawer();
    }
  };

  return (
    <Drawer
      variant="permanent"
      {...other}
    >
      <List disablePadding>
        <ListItem sx={{ ...item, ...itemCategory, fontSize: 22, color: '#fff' }}>{title}</ListItem>
        <ListItem disablePadding>
          <ListItemButton
            selected={(config?.paths?.index || '/') === window.location.pathname}
            onClick={() => onLinkClick(config?.paths?.index || '/')}
            sx={item}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText>Home</ListItemText>
          </ListItemButton>
        </ListItem>
        {mainItems.map(({ id, children }) => (
          <Box
            key={id}
            sx={{ bgcolor: '#101F33' }}
          >
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: '#fff' }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, href, icon }) => (
              <ListItem
                disablePadding
                key={childId}
              >
                <ListItemButton
                  selected={href === window.location.pathname}
                  onClick={() => onLinkClick(href || '/')}
                  sx={item}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{childId}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}
