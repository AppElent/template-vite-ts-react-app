import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover, { PopoverProps } from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

interface CustomPopoverProps extends PopoverProps {
  handleClick: (id: string) => void;
  options: {
    id: string;
    label: string;
    transLationKey?: string;
    icon: string;
  }[];
}

export const CustomPopover = (props: CustomPopoverProps) => {
  const { handleClick, options, ...other } = props;
  //const popover = usePopover();

  return (
    <Popover
      //anchorEl={popover.anchorRef.current}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom',
      }}
      disableScrollLock
      transformOrigin={{
        horizontal: 'right',
        vertical: 'top',
      }}
      //onClose={popover.handleClose}
      //open={popover.open}
      PaperProps={{ sx: { width: 220 } }}
      {...other}
    >
      {options.map((option) => {
        return (
          <MenuItem
            onClick={() => handleClick(option.id)}
            key={option.id}
          >
            <ListItemIcon>
              <Box
                sx={{
                  width: 28,
                  '& img': {
                    width: '100%',
                  },
                }}
              >
                <img
                  alt={option.label}
                  src={option.icon}
                />
              </Box>
            </ListItemIcon>
            <ListItemText primary={<Typography variant="subtitle2">{option.label}</Typography>} />
          </MenuItem>
        );
      })}
    </Popover>
  );
};

export default CustomPopover;
