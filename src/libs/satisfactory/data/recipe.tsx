import { SatisfactoryRecipe } from '..';
import BaseItem from './base-item';

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

  constructor(data: SatisfactoryRecipe) {
    super(data);
    this.alternate = data.alternate;
    this.time = data.time;
    this.inHand = data.inHand;
    this.forBuilding = data.forBuilding;
    this.inWorkshop = data.inWorkshop;
    this.inMachine = data.inMachine;
    this.manualTimeMultiplier = data.manualTimeMultiplier;
    this.ingredients = data.ingredients;
    this.products = data.products;
    this.producedIn = data.producedIn;
    this.isVariablePower = data.isVariablePower;
    this.minPower = data.minPower;
    this.maxPower = data.maxPower;
  }
}
