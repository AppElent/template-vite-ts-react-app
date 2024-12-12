import SatisfactoryData from '../data/satisfactory-data';

export type NodeType = 'mine' | 'sink' | 'product' | 'byproduct' | 'input' | 'recipe';

export default class Node {
  constructor(
    public id: string,
    public type: NodeType,
    public item: string,
    public amount: number,
    public data: SatisfactoryData
  ) {}

  getInputs = () => {
    if (this.type === 'recipe') {
      return this.getRecipe()?.ingredients || [];
    }
    return [];
  };

  getOutputs = () => {
    if (this.type === 'recipe') {
      return this.getRecipe()?.products || [];
    }
    return [];
  };

  getProduct = () => {
    return this.data.getProduct(this.item);
  };

  getRecipe = () => {
    return this.data.getRecipe(this.item);
  };
}
