// @ts-nocheck

import JsonViewer from '@andypf/json-viewer/dist/esm/react/JsonViewer';
import { JsonEditor as JsonEditorExternal } from 'json-edit-react';

const JsonEditor = ({ data, ...options }: any) => {
  return (
    <div>
      {' '}
      <JsonViewer
        data={JSON.stringify(data)}
        expanded={false}
      />
      <JsonEditorExternal
        data={data}
        setData={(alldata: any) => console.log(alldata)} // optional
        theme={['githubLight']}
        restrictDrag={false}
        restrictDelete={false}
        collapse={true}
      />
    </div>
  );
};

export default JsonEditor;
