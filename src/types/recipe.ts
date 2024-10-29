export default interface Recipe {
  id: string;
  name: string;
  cookingTime?: number;
  image?: string;
  ingredients?: string[];
  instructions?: string[];
  comments?: string;
  images?: string[];
  score?: number;
  url?: string;
  // new
  nutrition?: number;
  category?: string;
  keywords?: string[];
  dateAdded: string;
  numberOfServings?: number;
}
