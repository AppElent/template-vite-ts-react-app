import BaseItem from './base-item';

interface ProductClass extends BaseItem {
  isLiquid: boolean;
  stackSize: number;
  sinkPoints: number;
}

export default class Product extends BaseItem implements ProductClass {
  public isLiquid: boolean = false;
  public stackSize: number = 0;
  public sinkPoints: number;
  constructor(data: ProductClass) {
    super(data.className, data.slug, data.type, data.name);
    this.isLiquid = data.isLiquid;
    this.stackSize = data.stackSize;
    this.sinkPoints = data.sinkPoints;
  }

  toString = () => {
    return this.name;
  };
}
