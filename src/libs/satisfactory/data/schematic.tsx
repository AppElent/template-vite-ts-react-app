import { SatisfactorySchematic } from '..';
import BaseItem from './base-item';

// interface ProductClass extends BaseItem {
//   liquid: boolean;
//   stackSize: number;
//   sinkPoints: number;
// }

export default class Schematic extends BaseItem implements SatisfactorySchematic {
  public type: string;
  public cost: SatisfactorySchematic['cost'];
  public unlock: SatisfactorySchematic['unlock'];
  public time: SatisfactorySchematic['time'];
  public tier: SatisfactorySchematic['tier'];
  public mam: boolean;
  public alternate: boolean;

  constructor(data: SatisfactorySchematic) {
    super(data);
    this.type = data.type;
    this.cost = data.cost;
    this.unlock = data.unlock;
    this.time = data.time;
    this.tier = data.tier;
    this.mam = data.mam;
    this.alternate = data.alternate;
  }
}
