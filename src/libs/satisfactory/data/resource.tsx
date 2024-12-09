import { SatisfactoryResource } from '..';
import BaseItem from './base-item';

// interface ProductClass extends BaseItem {
//   liquid: boolean;
//   stackSize: number;
//   sinkPoints: number;
// }

export default class Resource extends BaseItem implements SatisfactoryResource {
  public pingColor: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  max: number;

  constructor(data: SatisfactoryResource) {
    super(data);
    this.pingColor = data.pingColor;
    this.max = data.max;
  }
}
