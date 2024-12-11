import { SatisfactoryItem, SatisfactoryResource } from '..';
import BaseItem from './base-item';
import SatisfactoryData from './satisfactory-data';

export default class Resource extends BaseItem implements SatisfactoryResource {
  public pingColor: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  max: number;

  constructor(
    resource: SatisfactoryResource,
    public data: SatisfactoryData
  ) {
    super(resource);
    this.pingColor = resource.pingColor;
    this.max = resource.max;
  }

  getProduct = () => {
    return this.data.findItem(this.className) as SatisfactoryItem;
  };
}
