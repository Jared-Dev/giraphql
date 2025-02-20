import builder, { Animal, Giraffe } from './builder';
import { AnimalRef } from './interfaces';

const GiraffeRef = builder.objectRef<Giraffe>('GiraffeFromRef');

builder.objectType(Giraffe, {
  name: 'GiraffeFromClass',
  interfaces: [Animal],
  isTypeOf: (value) => value instanceof Giraffe,
  description: 'Long necks, cool patterns, taller than you.',
  fields: (t) => ({
    name: t.exposeString('name', {}),
    age: t.int({
      resolve: () => 5, // hard coded so test don't break over time
    }),
  }),
});

builder.objectType('Giraffe', {
  description: 'Long necks, cool patterns, taller than you.',
  interfaces: ['Animal'],
  isTypeOf: (value) => value instanceof Giraffe,
  fields: (t) => ({
    name: t.exposeString('name', {}),
    age: t.int({
      resolve: () => 5, // hard coded so test don't break over time
    }),
    oldName: t.string({
      deprecationReason: 'should use name instead',
      args: {
        old: t.arg.boolean({ deprecationReason: 'because' }),
      },
      resolve: () => 'old',
    }),
  }),
});

builder.objectType(GiraffeRef, {
  description: 'Long necks, cool patterns, taller than you.',
  interfaces: () => [AnimalRef],
  isTypeOf: (value) => value instanceof Giraffe,
  fields: (t) => ({
    name: t.exposeString('name', {}),
    age: t.int({
      resolve: () => 5, // hard coded so test don't break over time
    }),
  }),
});

builder.queryFields((t) => ({
  giraffe: t.field({
    type: 'Giraffe',
    resolve: () => new Giraffe('James', new Date(Date.UTC(2012, 11, 12)), 5.2),
  }),
  giraffeClass: t.field({
    type: Giraffe,
    resolve: () => new Giraffe('James', new Date(Date.UTC(2012, 11, 12)), 5.2),
  }),
  giraffeRef: t.field({
    type: GiraffeRef,
    resolve: () => new Giraffe('James', new Date(Date.UTC(2012, 11, 12)), 5.2),
  }),
}));
