import * as Yup from 'yup';
import { Schema } from '.';
export const recipeSchema: Schema = {};

export const recipeYupSchema = Yup.object().shape({
  owner: Yup.string().required('Owner is required').default(''),
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
  yieldsText: Yup.string().optional().default(''),
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
  image: Yup.string().url('Image must be a valid URL').optional().default(''),
  images: Yup.array().of(Yup.string().url('Each image must be a valid URL')).optional().default([]),
  ingredients: Yup.array().of(Yup.string()).optional().default([]),
  instructions: Yup.array().of(Yup.string()).optional().default([]),
  comments: Yup.string().optional().default(''),
  score: Yup.number().optional().default(0),
  url: Yup.string().url('URL must be a valid URL').optional().default(''),
  //nutrition: Yup.number().optional(),
  category: Yup.string().optional().default(''),
  keywords: Yup.array().of(Yup.string()).optional().default([]),
  cuisine: Yup.array().of(Yup.string()).optional().default([]),
  // Date fields
  createdAt: Yup.string()
    .optional()
    .default(() => new Date().toISOString()),
  updatedAt: Yup.string()
    .optional()
    .default(() => new Date().toISOString()),
  // External fields
  site: Yup.string().optional().default(''),
  raw: Yup.mixed().optional().default({}),
});

export interface Recipe2 extends Yup.InferType<typeof recipeYupSchema> {
  // using interface instead of type generally gives nicer editor feedback
  randomString?: string;
}

export const recipeDefaultValues: Partial<Recipe2> = recipeYupSchema.getDefault();
