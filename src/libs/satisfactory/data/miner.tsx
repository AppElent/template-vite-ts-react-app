import { SatisfactoryMiner } from '..';
import BaseItem from './base-item';

export default class Miner extends BaseItem implements SatisfactoryMiner {
  public allowedResources: string[];
  public extractionRate: number;

  constructor(data: SatisfactoryMiner) {
    super(data);
    this.allowedResources = data.allowedResources;
    this.extractionRate = data.extractionRate;
  }
}
