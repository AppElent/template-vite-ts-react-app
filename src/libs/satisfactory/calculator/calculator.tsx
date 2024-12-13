import { SatisfactoryData } from '../data/satisfactory-data';
import Edge from './edge';
import Node from './node';
import SatisfactoryModelerConnector from './satisfactory-modeler-connector';
import ToolsConnector from './tools-connector';

export default class Calculator {
  public tools: ToolsConnector;
  public modeler: SatisfactoryModelerConnector;
  constructor(public data: SatisfactoryData) {
    this.tools = new ToolsConnector(this);
    this.modeler = new SatisfactoryModelerConnector(this);
  }

  getNodes = () => {};

  generateEdges = (nodes: Node[]): Edge[] => {
    // TODO: werkt nog niet, oa getallen verkeerd en tekst toevoegen water
    const edges: Edge[] = [];
    for (const node of nodes) {
      const inputs = node.getInputs();
      console.log('INPUTS', node.id, inputs);
      for (const input of inputs) {
        let inputAmount = input.amount;
        const products = nodes.filter((n) => n.item === input.item && n.id !== node.id);
        for (const product of products) {
          const usedAmount = product?.useAmount(inputAmount) || 0;
          if (usedAmount > 0) {
            const edge = new Edge(
              { source: product.id, target: node.id, amount: usedAmount, item: input.item },
              this
            );
            inputAmount = inputAmount - usedAmount;
            edges.push(edge);
          }
        }
        const recipeNodes = nodes.filter(
          (n) => n.type === 'recipe' && n.getRecipe()?.products.some((i) => i.item === input.item)
        );
        for (const recipeNode of recipeNodes) {
          // TODO: deze useamount hier is niet goed
          const usedAmount = recipeNode.useAmount(inputAmount);
          console.log('RECIPE', node.item, recipeNode.id, usedAmount, inputAmount);
          if (usedAmount > 0) {
            const edge = new Edge(
              { source: recipeNode.item, target: node.item, amount: usedAmount, item: input.item },
              this
            );
            edges.push(edge);
          }
        }

        // const edge = {
        //   source: input.item,
        //   target: node.item,
        //   amount: input.amount,
        // };
        // edges.push(edge);
      }
    }
    return edges;
  };
}
