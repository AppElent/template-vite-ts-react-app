export default interface Recipe {
  id: string;
  name: string;
  cookingTime?: number;
  image?: string;
  images?: string[];
  ingredients?: string[];
  instructions?: string[];
  comments?: string;

  score?: number;
  url?: string;
  // new
  nutrition?: number;
  category?: string;
  keywords?: string[];
  numberOfServings?: number;
  description?: string;
  cuisine: string[];
  // date fields
  createdAt?: string;
  updatedAt?: string;
}
