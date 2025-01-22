import { Box, Button, Paper } from '@mui/material';
// import { useState } from 'react';
import { useData } from '@/libs/data-sources';
import { Dummy } from '@/schemas/dummy';
import DefaultPaperbasePage from './DefaultPaperbasePage';

interface ISettings {
  test: string;
}

const Settings = () => {
  const settings = useData<ISettings>('settings');
  const dummy = useData<Dummy>('calculator_configs');
  console.log(settings, dummy.data.push);

  return (
    <DefaultPaperbasePage title="Settings">
      <Box sx={{ flexGrow: 1 }}>
        {/* <ReactJson
          src={JSON.stringify(getSatisfactoryDataNew())}
          theme="monokai"
        /> */}
        <Paper sx={{ margin: 'auto', overflow: 'hidden', py: 2, px: 2 }}>
          {JSON.stringify(settings.data)}
          <Button
            onClick={() => {
              settings.actions.set({ test: 'test' }, 'id1');
            }}
          >
            Add data
          </Button>
        </Paper>
      </Box>
    </DefaultPaperbasePage>
  );
};

export default Settings;
