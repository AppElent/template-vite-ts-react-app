import { SatisfactoryBuildable } from '..';
import BaseItem from './base-item';

export default class Buildable extends BaseItem implements SatisfactoryBuildable {
  public description: string;

  constructor(data: SatisfactoryBuildable) {
    super(data);
    this.description = data.description;
  }
}
