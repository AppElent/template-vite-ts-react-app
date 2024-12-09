import { SatisfactoryItem } from '..';
import BaseItem from './base-item';

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

  constructor(data: SatisfactoryItem) {
    super(data);
    this.description = data.description;
    this.liquid = data.liquid;
    this.stackSize = data.stackSize;
    this.sinkPoints = data.sinkPoints;
    this.tier = data.tier;
    this.energyValue = data.energyValue;
    this.isEquipment = data.isEquipment;
    this.isRadioactive = data.isRadioactive;
    this.isFuel = data.isFuel;
    this.isResource = data.isResource;
  }
}
