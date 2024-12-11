import { SatisfactoryBuilding } from '..';
import BaseItem from './base-item';
import SatisfactoryData from './satisfactory-data';

// interface ProductClass extends BaseItem {
//   liquid: boolean;
//   stackSize: number;
//   sinkPoints: number;
// }

export default class Building extends BaseItem implements SatisfactoryBuilding {
  public description: string;
  public metadata: {
    powerConsumption: number;
    powerConsumptionExponent: number;
    manufacturingSpeed: number;
  };

  constructor(
    building: SatisfactoryBuilding,
    public data: SatisfactoryData
  ) {
    super(building);
    this.description = building.description;
    this.metadata = building.metadata;
  }

  getBuildable = () => {
    return this.data.findBuildable(this.className);
  };
}
