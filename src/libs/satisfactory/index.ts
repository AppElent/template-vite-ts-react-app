export interface SatisfactoryBaseItem {
  className: string;
  name: string;
  slug: string;
}

export interface SatisfactoryItem extends SatisfactoryBaseItem {
  description: string;
  sinkPoints: number;
  stackSize: number;
  energyValue: number;
  liquid: boolean;
  tier: number;
  isEquipment: boolean;
  isRadioactive: boolean;
  isFuel: boolean;
  isResource: boolean;
}

export interface SatisfactoryRecipe extends SatisfactoryBaseItem {
  alternate: boolean;
  time: number;
  inHand: boolean;
  forBuilding: boolean;
  inWorkshop: boolean;
  inMachine: boolean;
  manualTimeMultiplier: number;
  ingredients: {
    item: string;
    amount: number;
    name: string;
    amountMin: number;
  }[];
  products: {
    item: string;
    amount: number;
    name: string;
    amountMin: number;
  }[];
  producedIn: string;
  isVariablePower: boolean;
  minPower: number;
  maxPower: number;
}

export type SatisfactoryBuildableRecipe = Omit<SatisfactoryRecipe, 'producedIn'>;

export interface SatisfactoryResource extends SatisfactoryBaseItem {
  pingColor: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  max: number;
}

export interface SatisfactoryBuilding extends SatisfactoryBaseItem {
  description: string;
  power: number;
}

export interface SatisfactoryBelts extends SatisfactoryBaseItem {
  rate: number;
}

export interface SatisfactoryBuildable extends SatisfactoryBaseItem {
  description: string;
}

export interface SatisfactorySchematic extends SatisfactoryBaseItem {
  type: string;
  cost: {
    item: string;
    amount: number;
  }[];
  unlock: {
    recipes: string[];
    scannerResources: string[];
    inventorySlots: number;
    giveItems: { item: string; amount: number }[];
  };
  tier: number;
  time: number;
  mam: boolean;
  alternate: boolean;
}

export interface SatisfactoryGenerator extends SatisfactoryBaseItem {
  fuel: string[];
  powerProduction: number;
}

export interface SatisfactoryMiner extends SatisfactoryBaseItem {
  allowedResources: string[];
  extractionRate: number;
}
