import { AppBar, Box, IconButton, Stack, Tab, Tabs, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';

const TabSection = ({ tabs, buttons }) => {
  console.log(tabs);
  return (
    <AppBar
      component="div"
      position="static"
      elevation={0}
      sx={{ zIndex: 0 }}
    >
      <Stack
        direction="row"
        justifyContent={'space-between'}
        spacing={1}
      >
        <Box>
          {tabs && (
            <Tabs
              indicatorColor="primary"
              onChange={tabs.handleTabChange}
              scrollButtons="auto"
              textColor="inherit"
              value={tabs.tab}
              variant="scrollable"
            >
              {tabs.tabsData?.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                />
              ))}
              {/* <Tab label="Users" />
        <Tab label="Sign-in method" />
        <Tab label="Templates" />
        <Tab label="Usage" /> */}
            </Tabs>
          )}
        </Box>

        <Stack
          direction="row"
          spacing={1}
        >
          {buttons?.map((button) => {
            return (
              <Tooltip
                title={button.tooltip}
                placement="top"
                key={button.tooltip}
              >
                <IconButton
                  onClick={button.onClick}
                  //color="primary"
                >
                  {button.icon}
                </IconButton>
              </Tooltip>
            );
          })}
        </Stack>
      </Stack>
    </AppBar>
  );
};

TabSection.propTypes = {
  tabs: PropTypes.any,
  buttons: PropTypes.array,
};

export default TabSection;
