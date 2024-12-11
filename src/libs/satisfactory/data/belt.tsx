import { SatisfactoryBelts } from '..';
import BaseItem from './base-item';
import SatisfactoryData from './satisfactory-data';

// interface ProductClass extends BaseItem {
//   liquid: boolean;
//   stackSize: number;
//   sinkPoints: number;
// }

export default class Belt extends BaseItem implements SatisfactoryBelts {
  public rate: number;

  constructor(
    belt: SatisfactoryBelts,
    public data: SatisfactoryData
  ) {
    super(belt);
    this.rate = belt.rate;
  }

  getBuildable = () => {
    return this.data.findBuildable(this.className);
  };
}
