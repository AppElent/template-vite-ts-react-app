import * as Yup from 'yup';
import { Schema } from '.';
export const recipeSchema: Schema = {};

export const recipeYupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').min(3, 'Minimum 3 characters').default(''),
  description: Yup.string().optional().default(''),
  time: Yup.object()
    .shape({
      prep: Yup.number().optional().default(0),
      cooking: Yup.number().optional().default(0),
      total: Yup.number().optional().default(0),
    })
    .optional(),
  yields: Yup.object().shape({
    quantity: Yup.number().optional().default(0),
    unit: Yup.string().optional().default('servings'),
  }),
  nutrients: Yup.object()
    .shape({
      calories: Yup.string().optional().default('0'),
      fat: Yup.string().optional().default('0'),
      sugar: Yup.string().optional().default('0'),
      fiber: Yup.string().optional().default('0'),
      protein: Yup.string().optional().default('0'),
      carbs: Yup.string().optional().default('0'),
    })
    .optional(),
  image: Yup.string().url('Image must be a valid URL').optional(),
  images: Yup.array().of(Yup.string().url('Each image must be a valid URL')).optional(),
  ingredients: Yup.array().of(Yup.string()).optional(),
  instructions: Yup.array().of(Yup.string()).optional(),
  comments: Yup.string().optional().default(''),
  score: Yup.number().optional(),
  url: Yup.string().url('URL must be a valid URL').optional().default(''),
  //nutrition: Yup.number().optional(),
  category: Yup.string().optional().default(''),
  keywords: Yup.array().of(Yup.string()).optional(),
  cuisine: Yup.array().of(Yup.string()).optional(),
  // Date fields
  createdAt: Yup.string()
    .optional()
    .default(() => new Date().toISOString()),
  updatedAt: Yup.string()
    .optional()
    .default(() => new Date().toISOString()),
  // External fields
  site: Yup.string().optional().default(''),
  raw: Yup.mixed().optional(),
});
