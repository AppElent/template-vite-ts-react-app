import { SatisfactoryBuilding } from '..';
import BaseItem from './base-item';

// interface ProductClass extends BaseItem {
//   liquid: boolean;
//   stackSize: number;
//   sinkPoints: number;
// }

export default class Building extends BaseItem implements SatisfactoryBuilding {
  public description: string;
  public power: number;

  constructor(data: SatisfactoryBuilding) {
    super(data);
    this.description = data.description;
    this.power = data.power;
  }
}
