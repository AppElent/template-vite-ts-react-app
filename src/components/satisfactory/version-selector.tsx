import CustomPopover from '@/components/default/custom-popover';
import { usePopover } from '@/hooks/use-popover';
import satisfactoryData from '@/libs/satisfactory/data/satisfactory-data';
import { Button, Chip, ListItemIcon, MenuItem, Tooltip } from '@mui/material';

const VersionedAvatar = ({ version = '1.0', size = 40 }) => (
  <Chip
    color="info"
    label={version}
  />
);

const versionItems = satisfactoryData.getVersions().map((version) => ({
  id: version.key,
  label: version.label,
  shortLabel: version.shortLabel,
}));

const VersionSelector = () => {
  const popover = usePopover();
  const currentVersion = satisfactoryData.version;

  const handleMenuItemClick = (version: string) => async () => {
    satisfactoryData.setVersion(version);

    popover.handleClose();
  };

  return (
    <>
      <Tooltip title="User">
        <Button
          color="inherit"
          //sx={{ p: 0.5 }}
          onClick={popover.handleOpen}
          ref={popover.anchorRef}
        >
          <VersionedAvatar version={currentVersion.shortLabel} />
        </Button>
      </Tooltip>

      <CustomPopover
        anchorEl={popover.anchorRef.current}
        open={popover.open}
        onClose={popover.handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {versionItems.map((item) => {
          return (
            <MenuItem
              onClick={handleMenuItemClick(item.id)}
              key={item.id}
            >
              <ListItemIcon sx={{ width: '63px' }}>
                <VersionedAvatar version={item.shortLabel} />
              </ListItemIcon>
              {item.label}
            </MenuItem>
          );
        })}
        {/* <MenuItem onClick={handleMenuItemClick('account')}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Account
        </MenuItem>
        <MenuItem onClick={handleMenuItemClick('profile')}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={auth.signOut}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem> */}
      </CustomPopover>
    </>
  );
};

export default VersionSelector;
