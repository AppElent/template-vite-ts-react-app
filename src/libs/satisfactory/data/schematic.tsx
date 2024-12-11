import { SatisfactorySchematic } from '..';
import BaseItem from './base-item';
import SatisfactoryData from './satisfactory-data';

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

  constructor(
    schematic: SatisfactorySchematic,
    public data: SatisfactoryData
  ) {
    super(schematic);
    this.type = schematic.type;
    this.cost = schematic.cost;
    this.unlock = schematic.unlock;
    this.time = schematic.time;
    this.tier = schematic.tier;
    this.mam = schematic.mam;
    this.alternate = schematic.alternate;
  }
}
