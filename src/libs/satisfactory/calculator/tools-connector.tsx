import SatisfactoryData from '../data/satisfactory-data';

interface ProductionItem {
  item: string;
  type: 'perMinute' | 'max';
  amount: number;
  ratio: number;
}

interface ProductionInput {
  item: string;
  amount: number;
}

interface ShareRequest {
  metadata: {
    gameVersion: string;
    icon: string;
    name: string;
    schemaVersion: number;
  };
  request: ToolsRequest;
}

interface ToolsRequest {
  allowedAlternateRecipes: string[];
  blockedRecipes: string[];
  blockedResources: string[];
  blockedMachines?: string[];
  sinkableResources: string[];
  production: ProductionItem[];
  input: ProductionInput[];
  resourceMax: {
    Desc_OreIron_C: number;
    Desc_OreCopper_C: number;
    Desc_Stone_C: number;
    Desc_Coal_C: number;
    Desc_OreGold_C: number;
    Desc_LiquidOil_C: number;
    Desc_RawQuartz_C: number;
    Desc_Sulfur_C: number;
    Desc_OreBauxite_C: number;
    Desc_OreUranium_C: number;
    Desc_NitrogenGas_C: number;
    Desc_SAM_C: number;
    Desc_Water_C: number;
  };
  resourceWeight: {
    Desc_OreIron_C: number;
    Desc_OreCopper_C: number;
    Desc_Stone_C: number;
    Desc_Coal_C: number;
    Desc_OreGold_C: number;
    Desc_LiquidOil_C: number;
    Desc_RawQuartz_C: number;
    Desc_Sulfur_C: number;
    Desc_OreBauxite_C: number;
    Desc_OreUranium_C: number;
    Desc_NitrogenGas_C: number;
    Desc_SAM_C: number;
    Desc_Water_C: number;
  };
  gameVersion: string;
}

type ToolsOutput = {
  type: string;
  amount: number;
  item: string;
}[];

interface ToolsResponse {
  [key: string]: string;
}

export default class ToolsConnector {
  private baseUrl: string = 'https://api.satisfactorytools.com';
  private resourceWeight = {
    Desc_OreIron_C: 1,
    Desc_OreCopper_C: 2.4959349593495936,
    Desc_Stone_C: 1.3175965665236051,
    Desc_Coal_C: 2.1773049645390072,
    Desc_OreGold_C: 6.140000000000001,
    Desc_LiquidOil_C: 7.30952380952381,
    Desc_RawQuartz_C: 6.822222222222222,
    Desc_Sulfur_C: 8.527777777777779,
    Desc_OreBauxite_C: 7.487804878048781,
    Desc_OreUranium_C: 43.85714285714286,
    Desc_NitrogenGas_C: 7.675000000000001,
    Desc_SAM_C: 9.029411764705882,
    Desc_Water_C: 0,
  };
  private apiVersion: string = '1.0.0';
  private guiVersion: string = '1.0';
  private defaultSolveRequest: ToolsRequest = {
    allowedAlternateRecipes: [],
    blockedRecipes: [],
    blockedResources: [],
    sinkableResources: [],
    production: [],
    input: [],
    resourceMax: {
      Desc_OreIron_C: 0,
      Desc_OreCopper_C: 0,
      Desc_Stone_C: 0,
      Desc_Coal_C: 0,
      Desc_OreGold_C: 0,
      Desc_LiquidOil_C: 0,
      Desc_RawQuartz_C: 0,
      Desc_Sulfur_C: 0,
      Desc_OreBauxite_C: 0,
      Desc_OreUranium_C: 0,
      Desc_NitrogenGas_C: 0,
      Desc_SAM_C: 0,
      Desc_Water_C: 0,
    },
    resourceWeight: this.resourceWeight,
    gameVersion: this.apiVersion,
  };

  constructor(public data: SatisfactoryData) {
    this.defaultSolveRequest.gameVersion = this.data.version.tools.api;
    this.guiVersion = this.data.version.tools.gui;
    const resourceMax = data.getResourceMax();
    console.log(resourceMax);
    this.defaultSolveRequest.resourceMax = {
      ...this.defaultSolveRequest.resourceMax,
      ...resourceMax,
    };
  }

  parseToolsResponse = (response: ToolsResponse): ToolsOutput => {
    const nodes = [];
    const customTypes = ['Mine', 'Sink', 'Product', 'Byproduct', 'Input'];
    for (const recipeData in response) {
      const amount = parseFloat(response[recipeData] + '');
      const [machineData, machineClass] = recipeData.split('#');
      if (machineData === 'special__power') continue;
      if (customTypes.includes(machineClass)) {
        nodes.push({
          type: machineClass.toLowerCase(),
          amount,
          item: machineData,
        });
      } else {
        const [recipeClass] = machineData.split('@');
        nodes.push({
          type: 'recipe',
          amount,
          item: recipeClass,
        });
      }
    }

    return nodes;
  };

  solveProduction = async (request: Partial<ToolsRequest>): Promise<ToolsOutput> => {
    const result = await fetch(this.baseUrl + '/v2/solver', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...this.defaultSolveRequest, ...request }),
    });
    const res = await result.json();
    console.log(res);
    return this.parseToolsResponse(res.result);
  };

  saveProductionConfig = async (request: ShareRequest): Promise<string> => {
    const result = await fetch(this.baseUrl + '/v2/share?version=' + this.guiVersion, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...this.defaultSolveRequest, ...request }),
    });
    const res = await result.json();
    return res.link;
  };

  getProductionConfig = async (id: string): Promise<ShareRequest> => {
    const result = await fetch(this.baseUrl + '/v1/share/' + id);
    const res = await result.json();
    const returnData = res.data;
    if (returnData.request.blockedMachines && returnData.request.blockedMachines.length > 0) {
      console.log(returnData.request.blockedMachines);
      for (const machine of returnData.request.blockedMachines) {
        console.log(machine);
        const recipes = this.data.recipes.filter(
          (recipe) => recipe.producedIn === machine && !recipe.alternate
        );
        console.log(recipes);
        if (recipes.length > 0) {
          const classNames = recipes.map((recipe) => recipe.className);
          returnData.request.blockedRecipes.push(...classNames);
        }
      }
      delete returnData.request.blockedMachines;
    }
    return returnData;
  };
}
