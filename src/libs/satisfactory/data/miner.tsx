import { SatisfactoryMiner } from '..';
import BaseItem from './base-item';
import SatisfactoryData from './satisfactory-data';

export default class Miner extends BaseItem implements SatisfactoryMiner {
  public allowedResources: string[];
  public extractionRate: number;

  constructor(
    miner: SatisfactoryMiner,
    public data: SatisfactoryData
  ) {
    super(miner);
    this.allowedResources = miner.allowedResources;
    this.extractionRate = miner.extractionRate;
  }

  getBuildable = () => {
    return this.data.findBuildable(this.className);
  };
}
