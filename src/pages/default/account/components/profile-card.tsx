import { CameraAlt as CameraAltIcon } from '@mui/icons-material';
import { Avatar, Button, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material';
import { useState } from 'react';

interface ProfileCardProps {
  profile: any;
  setProfile: (profile: any) => void;
}

const ProfileCard = ({ profile, setProfile }: ProfileCardProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('/placeholder.svg?height=100&width=100');

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  console.log(profile, setProfile); // TODO: implement

  return (
    <Card>
      <CardHeader title="Profile Settings" />
      <CardContent>
        <Grid
          container
          spacing={2}
          alignItems="center"
        >
          <Grid item>
            <Avatar
              src={avatarUrl}
              alt="Profile Avatar"
              sx={{ width: 100, height: 100 }}
            />
          </Grid>
          <Grid item>
            <input
              accept="image/*"
              id="avatar-upload"
              type="file"
              hidden
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<CameraAltIcon />}
              >
                Change Avatar
              </Button>
            </label>
          </Grid>
        </Grid>
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
