import { SatisfactoryItem } from '..';
import BaseItem from './base-item';
import SatisfactoryData from './satisfactory-data';

// interface ProductClass extends BaseItem {
//   liquid: boolean;
//   stackSize: number;
//   sinkPoints: number;
// }

export default class Product extends BaseItem implements SatisfactoryItem {
  public description: string;
  public liquid: boolean = false;
  public stackSize: number = 0;
  public sinkPoints: number;
  public tier: number;
  public energyValue: number;
  public isEquipment: boolean;
  public isRadioactive: boolean;
  public isFuel: boolean;
  public isResource: boolean = false;
  private data: SatisfactoryData;

  constructor(product: SatisfactoryItem, data: SatisfactoryData) {
    super(product);
    this.description = product.description;
    this.liquid = product.liquid;
    this.stackSize = product.stackSize;
    this.sinkPoints = product.sinkPoints;
    this.tier = product.tier;
    this.energyValue = product.energyValue;
    this.isEquipment = product.isEquipment;
    this.isRadioactive = product.isRadioactive;
    this.isFuel = product.isFuel;
    this.isResource = product.isResource;
    this.data = data;
  }

  getRecipes = () => {
    return this.data.recipes.filter((recipe) =>
      recipe.products.find((p) => p.item === this.className)
    );
  };

  getDefaultRecipe = () => {
    return this.getRecipes().find((recipe) => !recipe.alternate);
  };

  getProductionRate = () => {
    const recipe = this.getDefaultRecipe();
    const productItem = recipe?.products.find((p) => p.item === this.className);
    return productItem?.amountMin || 0;
  };

  getAlternateRecipes = () => {
    return this.getRecipes().filter((recipe) => recipe.alternate);
  };

  getUsedFor = () => {
    return this.data.recipes.filter((recipe) =>
      recipe.ingredients.find((i) => i.item === this.className)
    );
  };
}
