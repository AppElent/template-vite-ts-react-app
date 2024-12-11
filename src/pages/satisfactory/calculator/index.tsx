import ToolsConnector from '@/libs/satisfactory/calculator/tools-connector';
import SatisfactoryData from '@/libs/satisfactory/data/satisfactory-data';
import { Button } from '@mui/material';
import { useState } from 'react';
import DefaultPage from '../../default/DefaultPage';
import RecipeSelector from './_components/recipe-selector';

const Calculator = () => {
  const data = new SatisfactoryData();
  const tools = new ToolsConnector(data);

  const [request, setRequest] = useState<any>();
  const [result, setResult] = useState<any[]>();
  return (
    <DefaultPage>
      <Button
        onClick={async () => {
          const result = await tools.getProductionConfig('oMCaJpL6YIQrmQ6ON7Oq');
          setRequest(result.request);
        }}
      >
        Get data
      </Button>
      <Button
        onClick={async () => {
          const result = await tools.solveProduction(request);
          setResult(result);
        }}
      >
        Solve
      </Button>
      <br />
      Request:
      <pre>{JSON.stringify(request, null, 2)}</pre>
      Result:
      <br />
      {/* <JsonEditor data={result} /> */}
      <pre>{JSON.stringify(result, null, 2)}</pre>
      <RecipeSelector recipes={data.recipes} />
    </DefaultPage>
  );
};

export default Calculator;
