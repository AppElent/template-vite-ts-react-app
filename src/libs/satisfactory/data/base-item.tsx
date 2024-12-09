export interface BaseItemClass {
  className: string;
  slug: string;
  name: string;
}

export default class BaseItem implements BaseItemClass {
  public className: string;
  public slug: string;
  public name: string;

  constructor(data: BaseItemClass) {
    this.className = data.className;
    this.slug = data.slug;
    this.name = data.name;
  }

  public toString(): string {
    return this.name;
  }
}
