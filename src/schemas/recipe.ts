import * as Yup from 'yup';
import { Schema } from '.';
export const recipeSchema: Schema = {};

export const recipeYupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').min(3, 'Minimum 3 characters'),
  cookingTime: Yup.number().optional(),
  image: Yup.string().url('Image must be a valid URL').optional(),
  images: Yup.array().of(Yup.string().url('Each image must be a valid URL')).optional(),
  ingredients: Yup.array().of(Yup.string()).optional(),
  instructions: Yup.array().of(Yup.string()).optional(),
  comments: Yup.string().optional(),
  score: Yup.number().optional(),
  url: Yup.string().url('URL must be a valid URL').optional(),
  nutrition: Yup.number().optional(),
  category: Yup.string().optional(),
  keywords: Yup.array().of(Yup.string()).optional(),
  numberOfServings: Yup.number().optional(),
  description: Yup.string().optional(),
  cuisine: Yup.array().of(Yup.string()).required('Cuisine is required'),
  createdAt: Yup.string().optional(),
  updatedAt: Yup.string().optional(),
});

console.log(recipeYupSchema.describe());
console.log(Yup.reach(recipeYupSchema, 'name'));
console.log();
