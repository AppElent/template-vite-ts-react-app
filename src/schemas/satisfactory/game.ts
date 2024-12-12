import * as Yup from 'yup';
import { factoryYupSchema } from './factory';
import { powerStationYupSchema } from './powerStation';

export const gameYupSchema = Yup.object().shape({
  id: Yup.string().required().min(3),
  name: Yup.string().required().min(3),
  factories: Yup.array().of(factoryYupSchema),
  notes: Yup.string().min(3),
  todos: Yup.array().of(Yup.string().min(3)),
  powerStations: Yup.array().of(powerStationYupSchema),
  version: Yup.string().required(),
});

export type Factory = Yup.InferType<typeof gameYupSchema>;
