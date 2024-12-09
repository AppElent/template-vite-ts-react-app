interface ToolsRequest {
  allowedAlternateRecipes: string[];
  blockedRecipes: string[];
  blockedResources: string[];
  sinkableResources: string[];
  production: {
    item: string;
    type: string;
    amount: number;
    ratio: number;
  }[];
  input: {
    item: string;
    amount: number;
  }[];
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
  private gameVersion: string = '1.0.0';
  private defaultRequest: ToolsRequest = {
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
    gameVersion: this.gameVersion,
  };

  solver = async (request: Partial<ToolsRequest>) => {
    return fetch(this.baseUrl + '/v2/solver', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...this.defaultRequest, ...request }),
    }).then((res) => res.json());
  };

  share = async (request: Partial<ToolsRequest>) => {
    return fetch(this.baseUrl + '/v2/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...this.defaultRequest, ...request }),
    }).then((res) => res.json());
  };

  getShared = async (id: string) => {
    return fetch(this.baseUrl + '/v2/share/' + id).then((res) => res.json());
  };
}
