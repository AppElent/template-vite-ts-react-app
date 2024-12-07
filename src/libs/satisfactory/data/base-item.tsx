export interface BaseItemClass {
  className: string;
  slug: string;
  type: 'products' | 'recipes' | 'resources';
  name: string;
}

export default class BaseItem implements BaseItemClass {
  constructor(
    public className: string,
    public slug: string,
    public type: BaseItemClass['type'],
    public name: string
  ) {}

  public toString(): string {
    return this.name;
  }
}
