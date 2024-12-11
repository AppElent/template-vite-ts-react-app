import { SatisfactoryBuildable } from '..';
import BaseItem from './base-item';
import SatisfactoryData from './satisfactory-data';

export default class Buildable extends BaseItem implements SatisfactoryBuildable {
  public description: string;
  public metadata: {
    powerConsumption: number;
    powerConsumptionExponent: number;
    manufacturingSpeed: number;
  };

  constructor(
    buildable: SatisfactoryBuildable,
    public data: SatisfactoryData
  ) {
    super(buildable);
    this.description = buildable.description;
    this.metadata = buildable.metadata;
  }
}
