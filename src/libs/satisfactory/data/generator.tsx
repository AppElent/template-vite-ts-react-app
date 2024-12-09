import { SatisfactoryGenerator } from '..';
import BaseItem from './base-item';

export default class Generator extends BaseItem implements SatisfactoryGenerator {
  public fuel: string[];
  public powerProduction: number;

  constructor(data: SatisfactoryGenerator) {
    super(data);
    this.fuel = data.fuel;
    this.powerProduction = data.powerProduction;
  }
}
