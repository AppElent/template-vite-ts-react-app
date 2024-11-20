import { InputAdornment } from '@mui/material';

// List of recipe categories
export const RECIPE_CATEGORIES = ['breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'appetizer'];

// List of recipe keywords
export const RECIPE_KEYWORDS = [
  'fast',
  'easy',
  'healthy',
  'vegetarian',
  'vegan',
  'gluten-free',
  'low-carb',
  'low-fat',
  'low-calorie',
  'high-protein',
  'high-fiber',
  'kid-friendly',
  'budget-friendly',
];

export const RECIPE_FIELDS = {
  name: {
    name: 'name',
    label: 'Name',
  },
  description: {
    name: 'description',
    label: 'Description',
  },
  cuisine: {
    name: 'cuisine',
    label: 'Cuisine',
    definition: 'tag_list',
    custom: {
      suggestions: RECIPE_CATEGORIES,
    },
  },
  ingredients: {
    name: 'ingredients',
    label: 'Ingredients',
    definition: 'list',
    custom: {
      header: true,
    },
  },
  instructions: {
    name: 'instructions',
    label: 'Instructions',
    definition: 'list',
    //initialValue: [recipe?.instructions || ['']],
    custom: {
      numbered: true,
      header: true,
      reorderable: true,
    },
  },
  prepTime: {
    name: 'time.prep',
    label: 'Prep Time',
    type: 'number',
    custom: {
      muiTextFieldProps: {
        slotProps: {
          input: {
            startAdornment: <InputAdornment position="start">Min</InputAdornment>,
          },
        },
      },
    },
  },
  cookTime: {
    name: 'time.cooking',
    label: 'Cooking Time',
    type: 'number',
    custom: {
      muiTextFieldProps: {
        slotProps: {
          input: {
            startAdornment: <InputAdornment position="start">Min</InputAdornment>,
          },
        },
      },
    },
  },
  totalTime: {
    name: 'time.total',
    label: 'Total Time',
    type: 'number',
    custom: {
      muiTextFieldProps: {
        slotProps: {
          input: {
            startAdornment: <InputAdornment position="start">Min</InputAdornment>,
          },
        },
      },
    },
  },
  comments: {
    name: 'comments',
    label: 'Comments',
  },
  score: {
    name: 'score',
    label: 'Score',
    type: 'number',
    definition: 'rating',
  },
  url: {
    name: 'url',
    label: 'URL',
    type: 'url',
  },
  nutrition: {
    name: 'nutrition',
    label: 'Nutrition info',
    type: 'number',
  },
  category: {
    name: 'category',
    label: 'Category',
  },
  yieldsQty: {
    name: 'yields.quantity',
    label: 'Quantity',
    type: 'number',
  },
  yieldsUnit: {
    name: 'yields.unit',
    label: 'Unit',
  },
  yieldsText: {
    name: 'yieldsText',
    label: 'Number of Servings',
  },
  keywords: {
    name: 'keywords',
    label: 'Keywords',
    definition: 'tag_list', //TODO: make list of keywords
    custom: {
      suggestions: RECIPE_KEYWORDS,
    },
  },
  calories: {
    name: 'nutrients.calories',
    type: 'object',
    label: 'Calories',
  },
};
