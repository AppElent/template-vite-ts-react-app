import { SatisfactoryBelts } from '..';
import BaseItem from './base-item';

// interface ProductClass extends BaseItem {
//   liquid: boolean;
//   stackSize: number;
//   sinkPoints: number;
// }

export default class Belt extends BaseItem implements SatisfactoryBelts {
  public rate: number;

  constructor(data: SatisfactoryBelts) {
    super(data);
    this.rate = data.rate;
  }
}
