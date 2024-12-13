// import buildableRecipes_v700 from './data/v700/buildableRecipes.json';
// import buildables_v700 from './data/v700/buildables.json';
// import items_v700 from './data/v700/items.json';
// import productionRecipes_v700 from './data/v700/productionRecipes.json';
// import resources_v700 from './data/v700/resources.json';
// import schematics_v700 from './data/v700/schematics.json';
// import tierList_v700 from './data/v700/tierList.json';
// import buildableRecipes_v800 from './data/v800/buildableRecipes.json';
// import buildables_v800 from './data/v800/buildables.json';
// import items_v800 from './data/v800/items.json';
// import productionRecipes_v800 from './data/v800/productionRecipes.json';
// import resources_v800 from './data/v800/resources.json';
// import schematics_v800 from './data/v800/schematics.json';
// import buildableRecipes_v1000 from './data/v800/buildableRecipes.json';
// import buildables_v1000 from './data/v800/buildables.json';
// import items_v1000 from './data/v800/items.json';
// import productionRecipes_v1000 from './data/v800/productionRecipes.json';
// import resources_v1000 from './data/v800/resources.json';
// import schematics_v1000 from './data/v800/schematics.json';

// import data_v1000 from './data/v1000/data.json';
// import SatisfactoryDataType from './SatisfactoryDataType';

import {
  SatisfactoryBelts,
  SatisfactoryBuildable,
  SatisfactoryBuildableRecipe,
  SatisfactoryBuilding,
  SatisfactoryGenerator,
  SatisfactoryItem,
  SatisfactoryMiner,
  SatisfactoryRecipe,
  SatisfactoryResource,
  SatisfactorySchematic,
} from '..';
import BaseItem from './base-item';
import Belt from './belt';
import Buildable from './buildable';
import Building from './building';
import Generator from './generator';
import Miner from './miner';
import Product from './product';
import Recipe from './recipe';
import Resource from './resource';
import Schematic from './schematic';
import data_v1000 from './v1000/data.json';
import data_v1000_F from './v1000_F/data.json';

export interface SatisfactoryVersionData {
  items: SatisfactoryItem[];
  recipes: SatisfactoryRecipe[];
  buildableRecipes: SatisfactoryBuildableRecipe[];
  resources: SatisfactoryResource[];
  belts: SatisfactoryBelts[];
  buildings: SatisfactoryBuilding[];
  buildables: SatisfactoryBuildable[];
  generators: SatisfactoryGenerator[];
  miners: SatisfactoryMiner[];
  schematics: SatisfactorySchematic[];
}

type SatisfactoryDataObject = {
  [key: string]: SatisfactoryVersionData;
};

const satisfactory_data: SatisfactoryDataObject = {
  v1000: data_v1000,
  v1000_F: data_v1000_F,
};

const satisfactoryVersions = [
  {
    label: 'Update 1.0',
    shortLabel: '1.0',
    tools: {
      api: '1.0.0',
      gui: '1.0',
    },
    key: 'v1000',
  },
  {
    label: 'Update 1.0 (Ficsmas)',
    shortLabel: '1.0 (F)',
    tools: {
      api: '1.0.0-ficsmas',
      gui: '1.0-ficsmas',
    },
    key: 'v1000_F',
  },
];

export class SatisfactoryData {
  [key: string]: any;
  private currentVersion: (typeof satisfactoryVersions)[0]['key'] = 'v1000';
  public version: (typeof satisfactoryVersions)[0] =
    satisfactoryVersions.find((v) => v.key === this.currentVersion) || satisfactoryVersions[0];

  public data: SatisfactoryVersionData;

  // data
  public products: Product[] = [];
  public buildings: Building[] = [];
  public recipes: Recipe[] = [];
  public buildableRecipes: Recipe[] = [];
  public resources: Resource[] = [];
  public belts: Belt[] = [];
  public buildables: Buildable[] = [];
  public generators: Generator[] = [];
  public miners: Miner[] = [];
  public schematics: Schematic[] = [];

  constructor(versionKey?: string) {
    this.setVersion(versionKey);
    this.data = satisfactory_data[this.version.key];
    this.initData();
  }

  initData = () => {
    // Data
    this.data = satisfactory_data[this.version.key];
    this.recipes = this.data.recipes.map((item: SatisfactoryRecipe) => new Recipe(item, this));
    this.products = this.data.items.map((item: SatisfactoryItem) => new Product(item, this));
    this.buildables = this.data.buildables.map((item: any) => new Buildable(item, this));
    this.buildings = this.data.buildings.map((item: any) => new Building(item, this));

    this.buildableRecipes = this.data.buildableRecipes.map((item: any) => new Recipe(item, this));
    this.resources = this.data.resources.map((item: any) => new Resource(item, this));
    this.belts = this.data.belts.map((item: any) => new Belt(item, this));
    this.generators = this.data.generators.map((item: any) => new Generator(item, this));
    this.miners = this.data.miners.map((item: any) => new Miner(item, this));
    this.schematics = this.data.schematics.map((item: any) => new Schematic(item, this));
    console.log(this);
  };

  getSavedSatisfactoryVersion = () => {
    const savedVersion = localStorage.getItem('satisfactory_version');
    if (!savedVersion) {
      return this.currentVersion;
    }
    return savedVersion;
  };

  setVersion(version?: string) {
    // Get satisfactory_version from localStorage, if not set, use default
    let satisfactoryVersionKey = this.getSavedSatisfactoryVersion();
    // If version supplied and different from versionKey, set versionKey
    if (version && version !== satisfactoryVersionKey) {
      localStorage.setItem('satisfactory_version', version);
      satisfactoryVersionKey = version;
    }
    const versionObject = satisfactoryVersions.find((v) => v.key === satisfactoryVersionKey);
    if (!versionObject) {
      throw new Error('Version not found');
    }
    this.version = versionObject;
    console.log('SET NEW SATISFACTORY VERSION', versionObject);
    this.initData();
  }

  getVersions() {
    return satisfactoryVersions;
  }

  // Get functions
  getRecipe = (recipeClass: string) => this.recipes.find((r) => r.className === recipeClass);
  getProduct = (productClass: string) => this.products.find((p) => p.className === productClass);
  getBuilding = (buildingClass: string) =>
    this.buildings.find((b) => b.className === buildingClass);
  getBuildableRecipe = (recipeClass: string) =>
    this.buildableRecipes.find((r) => r.className === recipeClass);
  getResource = (resourceClass: string) =>
    this.resources.find((r) => r.className === resourceClass);
  getBelt = (beltClass: string) => this.belts.find((b) => b.className === beltClass);
  getBuildable = (buildableClass: string) =>
    this.buildables.find((b) => b.className === buildableClass);
  getGenerator = (generatorClass: string) =>
    this.generators.find((g) => g.className === generatorClass);
  getMiner = (minerClass: string) => this.miners.find((m) => m.className === minerClass);
  getSchematic = (schematicClass: string) =>
    this.schematics.find((s) => s.className === schematicClass);

  getItem(type: string, className: string) {
    return (this[type as string] as BaseItem[])?.find((item) => item.className === className);
  }

  // Get all products that have no recipe as input
  getEndProducts = () => {
    return this.products.filter(
      (p) =>
        !p.isEquipment &&
        p.tier !== undefined &&
        p.tier !== 11 && // ammo
        !this.recipes
          .filter((recipe) => !recipe.alternate) // also include alternates?
          .find((r) => r.ingredients.find((i) => i.item === p.className))
    );
  };

  resolveRecipe(product: string, recipeList: { product: string; recipe: string }[] = []) {
    // Check if product is a resource. If so, return undefined
    if (this.resources.find((r) => r.className === product)) return undefined;
    // Get a list of default recipes excluding alternate recipes and package recipes
    const defaultRecipes = this.recipes.filter((r) => !r.alternate && !r.slug.includes('package-'));
    // Check input object to see if there is a preferred recipe
    const fixedRecipe = recipeList.find((r) => r.product === product);
    return fixedRecipe
      ? this.recipes.find((r) => (r.className = fixedRecipe.recipe))
      : defaultRecipes.find((r) => r.products.some((p) => p.item === product));
  }

  isResource(product: string) {
    return this.resources.find((r) => r.className === product);
  }

  getResourceMax() {
    return this.resources.reduce((acc: { [key: string]: number }, resource) => {
      acc[resource.className] = resource.max;
      return acc;
    }, {});
  }
}

const satisfactoryData = new SatisfactoryData();
export default satisfactoryData;
