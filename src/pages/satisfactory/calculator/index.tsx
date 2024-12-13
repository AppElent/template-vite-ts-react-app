import CalculatorClass from '@/libs/satisfactory/calculator';
import satisfactoryData from '@/libs/satisfactory/data/satisfactory-data';
import DefaultPage from '@/pages/default/DefaultPage';
import { useEffect, useState } from 'react';
import RecipeSelector from './_components/recipe-selector';

const Calculator = () => {
  const calculator = new CalculatorClass(satisfactoryData);

  const [request, setRequest] = useState<any>();
  const [result, setResult] = useState<any[]>();

  useEffect(() => {
    const load = async () => {
      const config = await calculator.tools.getProductionConfig('oMCaJpL6YIQrmQ6ON7Oq');
      setRequest(config.request);
      const result = await calculator.tools.solveProduction(config.request);
      setResult(result);
      console.log(result);
    };
    load();
  }, []);

  return (
    <DefaultPage>
      Request:
      <pre>{JSON.stringify(request, null, 2)}</pre>
      Result:
      <br />
      {/* <JsonEditor data={result} /> */}
      {/* <pre>{JSON.stringify(result, null, 2)}</pre> */}
      <RecipeSelector recipes={satisfactoryData.recipes} />
    </DefaultPage>
  );
};

export default Calculator;
