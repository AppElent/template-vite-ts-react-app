import { Button, Card, CardContent, CardHeader, TextField } from '@mui/material';
import { useState } from 'react';

interface PasswordCardProps {
  setPassword: (password: string) => void;
}

const PasswordCard = ({ setPassword }: PasswordCardProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setPassword(newPassword);
  };

  return (
    <Card>
      <CardHeader title="Account Settings" />
      <CardContent>
        <TextField
          fullWidth
          label="Current Password"
          type="password"
          variant="outlined"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="New Password"
          type="password"
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Confirm New Password"
          type="password"
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleChangePassword}
        >
          Change Password
        </Button>
      </CardContent>
    </Card>
  );
};

export default PasswordCard;
