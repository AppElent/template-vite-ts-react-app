export interface BaseItemClass {
  className: string;
  slug: string;
  name: string;
}

export default class BaseItem implements BaseItemClass {
  public className: string;
  public slug: string;
  public name: string;
  private staticFilePath = '/assets/satisfactory/items/';

  constructor(data: BaseItemClass) {
    this.className = data.className;
    this.slug = data.slug;
    this.name = data.name;
  }

  public toString(): string {
    return this.name;
  }

  getIcon = () => {
    return this.staticFilePath + this.className.replace(/_/g, '-').toLowerCase() + '_64.png';
  };

  getImage = () => {
    return this.staticFilePath + this.className.replace(/_/g, '-').toLowerCase() + '_256.png';
  };
}
