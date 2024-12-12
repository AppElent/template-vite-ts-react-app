import * as Yup from 'yup';

export const productionInputYupSchema = Yup.object().shape({
  item: Yup.string().required(),
  amount: Yup.number().required(),
});

export type ProductionInput = Yup.InferType<typeof productionInputYupSchema>;

export const productionItemYupSchema = Yup.object().shape({
  item: Yup.string().required(),
  type: Yup.string().required().oneOf(['perMinute', 'max']).default('perMinute'),
  amount: Yup.number().required().default(0),
  ratio: Yup.number().required().default(100),
});

export type ProductionItem = Yup.InferType<typeof productionItemYupSchema>;

export const calculatorYupSchema = Yup.object().shape({
  id: Yup.string().required().min(3),
  externalId: Yup.string().min(3),
  name: Yup.string().required().min(3),
  production: productionItemYupSchema,
  input: productionInputYupSchema,
  allowedAlternateRecipes: Yup.array().of(Yup.string().min(3)).default([]),
  blockedRecipes: Yup.array().of(Yup.string().min(3)).default([]),
  blockedResources: Yup.array().of(Yup.string().min(3)).default([]),
  blockedMachines: Yup.array().of(Yup.string().min(3)).default([]),
  sinkableResources: Yup.array().of(Yup.string().min(3)).default([]),
  resourceMax: Yup.object().shape({
    Desc_OreIron_C: Yup.number().required(),
    Desc_OreCopper_C: Yup.number().required(),
    Desc_Stone_C: Yup.number().required(),
    Desc_Coal_C: Yup.number().required(),
    Desc_OreGold_C: Yup.number().required(),
    Desc_LiquidOil_C: Yup.number().required(),
    Desc_RawQuartz_C: Yup.number().required(),
    Desc_Sulfur_C: Yup.number().required(),
    Desc_OreBauxite_C: Yup.number().required(),
    Desc_OreUranium_C: Yup.number().required(),
    Desc_NitrogenGas_C: Yup.number().required(),
    Desc_SAM_C: Yup.number().required(),
    Desc_Water_C: Yup.number().required(),
  }),
});

export type Calculator = Yup.InferType<typeof calculatorYupSchema>;
