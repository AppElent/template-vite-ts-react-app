import * as Yup from 'yup';
import { Schema } from '.';
export const dummySchema: Schema = {
  name: {
    type: 'string',
    required: true,
    minLength: 3,
  },
};

export const dummyYupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').min(3, 'Minimum 3 characters'),
  number: Yup.number().optional(),
  date: Yup.string().optional(),
  boolean: Yup.boolean().optional(),
  array: Yup.array().of(Yup.string()).optional(),
  object: Yup.object()
    .shape({
      key: Yup.string().required('Key is required').min(3, 'Minimum 3 characters'),
    })
    .optional(),
});

export interface Dummy extends Yup.InferType<typeof dummyYupSchema> {
  // using interface instead of type generally gives nicer editor feedback
  randomString?: string;
}

export default interface DummyBackup {
  name: string;
  number?: number;
  date?: string;
  boolean?: boolean;
  array?: string[];
  object?: {
    key: string;
  };
}

const dummyObject: Dummy = {};

// Or the other way around:
// let schema: Yup.ObjectSchema<Dummy> = dummyYupSchema;
