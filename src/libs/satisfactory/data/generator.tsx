import { SatisfactoryGenerator } from '..';
import BaseItem from './base-item';
import SatisfactoryData from './satisfactory-data';

export default class Generator extends BaseItem implements SatisfactoryGenerator {
  public fuel: string[];
  public powerProduction: number;

  constructor(
    generator: SatisfactoryGenerator,
    public data: SatisfactoryData
  ) {
    super(generator);
    this.fuel = generator.fuel;
    this.powerProduction = generator.powerProduction;
  }

  getBuildable = () => {
    return this.data.findBuildable(this.className);
  };
}
