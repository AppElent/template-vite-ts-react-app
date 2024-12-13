import { SatisfactoryRecipe } from '..';
import BaseItem from './base-item';
import { SatisfactoryData } from './satisfactory-data';

// interface ProductClass extends BaseItem {
//   liquid: boolean;
//   stackSize: number;
//   sinkPoints: number;
// }

export default class Recipe extends BaseItem implements SatisfactoryRecipe {
  public alternate: boolean;
  public time: number;
  public inHand: boolean;
  public forBuilding: boolean;
  public inWorkshop: boolean;
  public inMachine: boolean;
  public manualTimeMultiplier: number;
  public ingredients: SatisfactoryRecipe['ingredients'];
  public products: SatisfactoryRecipe['products'];
  public producedIn: string;
  public isVariablePower: boolean;
  public minPower: number;
  public maxPower: number;
  public cyclesMin: number;
  public data: SatisfactoryData;

  constructor(recipe: SatisfactoryRecipe, data: SatisfactoryData) {
    super(recipe);
    this.alternate = recipe.alternate;
    this.time = recipe.time;
    this.inHand = recipe.inHand;
    this.forBuilding = recipe.forBuilding;
    this.inWorkshop = recipe.inWorkshop;
    this.inMachine = recipe.inMachine;
    this.manualTimeMultiplier = recipe.manualTimeMultiplier;
    this.ingredients = recipe.ingredients;
    this.products = recipe.products;
    this.producedIn = recipe.producedIn;
    this.isVariablePower = recipe.isVariablePower;
    this.minPower = recipe.minPower;
    this.maxPower = recipe.maxPower;
    this.cyclesMin = recipe.cyclesMin;
    this.data = data;
  }

  getIngredients = () => {
    return this.ingredients.map((ingredient) => {
      const product = this.data.products.find((product) => product.className === ingredient.item);
      return {
        ...ingredient,
        product,
      };
    });
  };

  getProducts = () => {
    return this.products.map((p) => {
      const product = this.data.products.find((pr) => pr.className === p.item);
      return {
        ...p,
        product,
      };
    });
  };

  getProduct = () => {
    const foundProduct = this.products.find((p) => p.name === this.name);
    if (foundProduct) {
      return foundProduct;
    } else {
      return this.products[0];
    }
  };

  getIcon = () => {
    return this.data.products
      .find((p) => p.className === this.getProduct().item)
      ?.getIcon() as string;
  };

  getImage = () => {
    return this.data.products
      .find((p) => p.className === this.getProduct().item)
      ?.getImage() as string;
  };
}
