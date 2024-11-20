import * as Yup from 'yup';
import { Schema } from '.';
export const recipeSchema: Schema = {};

// TODO: Fix optional fields with default value... and then undefined values in firestore data

export const recipeYupSchema = Yup.object().shape({
  owner: Yup.string().required('Owner is required').label('Owner'),
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Minimum 3 characters')
    .default('')
    .label('Name')
    .meta({ default: '' }),
  description: Yup.string().optional().default('').label('Description').meta({ default: '' }),
  time: Yup.object()
    .shape({
      prep: Yup.number().optional().default(0).label('Preparation Time'),
      cooking: Yup.number().optional().default(0).label('Cooking Time'),
      total: Yup.number().optional().default(0).label('Total Time'),
    })
    .optional()
    .label('Time'),
  yields: Yup.object()
    .shape({
      quantity: Yup.number().optional().default(0).label('Quantity'),
      unit: Yup.string().optional().default('servings').label('Unit'),
    })
    .label('Yields'),
  yieldsText: Yup.string().optional().default('').label('Yields'),
  nutrients: Yup.object()
    .shape({
      calories: Yup.string().optional().default('0').label('Calories'),
      fat: Yup.string().optional().default('0').label('Fat'),
      sugar: Yup.string().optional().default('0').label('Sugar'),
      fiber: Yup.string().optional().default('0').label('Fiber'),
      protein: Yup.string().optional().default('0').label('Protein'),
      carbs: Yup.string().optional().default('0').label('Carbohydrates'),
    })
    .optional()
    .label('Nutrients'),
  image: Yup.string().url('Image must be a valid URL').optional().default('').label('Image'),
  images: Yup.array()
    .of(Yup.string().url('Each image must be a valid URL'))
    .optional()
    .default([])
    .label('Images'),
  ingredients: Yup.array()
    .of(Yup.string().min(2, 'Min 2 characters'))
    .optional()
    .default([''])
    .label('Ingredients'),
  instructions: Yup.array()
    .of(Yup.string().min(3, 'Min 3 characters'))
    .optional()
    .default([''])
    .label('Instructions'),
  comments: Yup.string().optional().default('').label('Comments'),
  score: Yup.number().optional().default(0).label('Score').nullable(),
  url: Yup.string().url('URL must be a valid URL').optional().default('').label('URL'),
  category: Yup.string().optional().default('').label('Category'),
  keywords: Yup.array()
    .of(Yup.string().min(2, 'Min 2 characters'))
    .optional()
    .default([])
    .label('Keywords'),
  cuisine: Yup.array()
    .of(Yup.string().min(2, 'Min 2 characters'))
    .optional()
    .default([])
    .label('Cuisine'),
  createdAt: Yup.string()
    .optional()
    .default(() => new Date().toISOString())
    .label('Created At'),
  updatedAt: Yup.string()
    .optional()
    .default(() => new Date().toISOString())
    .label('Updated At'),
  site: Yup.string().optional().nullable().default('').label('Site'),
  raw: Yup.mixed().optional().nullable().default({}).label('Raw'),
});

export type Recipe2 = Yup.InferType<typeof recipeYupSchema>;

export type RecipeTemplate = Omit<Recipe2, 'id'>;

// console.log(extractSchemaLabels(recipeYupSchema));

export const recipeDefaultValues: Partial<Recipe2> = recipeYupSchema.getDefault();
