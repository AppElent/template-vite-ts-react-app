import Notepad from '@/components/default/notepad';
import { useState } from 'react';

const TabNotepad = () => {
  const [data, setData] = useState<string>('');
  return (
    <Notepad
      placeholder={'Scribble here...'}
      sx={{
        flexGrow: 1,
        minHeight: '60vh',
      }}
      name="scribble"
      value={data}
      onChange={(v: string) => {
        if (v !== data) {
          setData(v);
        }
      }}
    />
  );
};

export default TabNotepad;
