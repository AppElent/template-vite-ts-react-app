import Calculator from './calculator';

export default class Edge {
  public id: string;
  public source: string;
  public target: string;
  public amount: number;
  public item: string;
  constructor(
    edge: {
      source: string;
      target: string;
      amount: number;
      item: string;
    },
    public calculator: Calculator
  ) {
    this.id = `${edge.source}-${edge.target}`;
    this.source = edge.source;
    this.target = edge.target;
    this.amount = edge.amount;
    this.item = edge.item;
  }
}
