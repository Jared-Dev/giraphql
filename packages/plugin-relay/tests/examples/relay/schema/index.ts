import './poll';
import './numbers';
import './cursors';
import builder from '../builder';

interface GlobalIDInputsShape {
  circular?: GlobalIDInputsShape;
  id: {
    id: string;
    typename: string;
  };
  idList: (
    | {
        id: string;
        typename: string;
      }
    | null
    | undefined
  )[];
}

interface CircularWithoutGlobalIds {
  circular?: CircularWithoutGlobalIds;
  id?: number | string;
}

const GlobalIDInput = builder.inputRef<GlobalIDInputsShape>('GlobalIDInput');
const NoGlobalIDInput = builder.inputRef<CircularWithoutGlobalIds>('NoGlobalIDInput');

const OtherInput = builder.inputType('OtherInput', {
  fields: (t) => ({
    someField: t.string(),
  }),
});

GlobalIDInput.implement({
  fields: (t) => ({
    circularWithoutGlobalIds: t.field({
      type: NoGlobalIDInput,
    }),
    circular: t.field({
      type: GlobalIDInput,
    }),
    id: t.globalID({
      required: true,
    }),
    otherList: t.field({
      type: [OtherInput],
      defaultValue: [{ someField: 'abc' }],
    }),
    idList: t.globalIDList({
      required: {
        list: true,
        items: false,
      },
    }),
  }),
});

NoGlobalIDInput.implement({
  fields: (t) => ({
    circular: t.field({
      type: NoGlobalIDInput,
    }),
    id: t.id({}),
  }),
});

builder.queryType({
  fields: (t) => ({
    inputGlobalID: t.string({
      args: {
        id: t.arg.globalID({
          required: true,
        }),
        normalId: t.arg.id({ required: true }),
        inputObj: t.arg({
          type: GlobalIDInput,
          required: true,
        }),
        idList: t.arg.globalIDList({
          required: {
            list: true,
            items: false,
          },
        }),
      },
      resolve(_parent, args) {
        return JSON.stringify(args);
      },
    }),
  }),
});

builder.mutationType({ fields: (_t) => ({}) });

const { inputType: ExampleMutationInput, payloadType: ExampleMutationPayload } =
  builder.relayMutationField(
    'exampleMutation',
    {
      inputFields: (t) => ({
        id: t.id({
          required: true,
        }),
      }),
    },
    {
      resolve: (_root, args) => {
        if (!args.input.clientMutationId) {
          throw new Error('clientMutationId is missing');
        }

        return Promise.resolve({ status: args.input.id === '123' ? 200 : 500 });
      },
    },
    {
      outputFields: (t) => ({
        itWorked: t.boolean({
          resolve: (parent) => parent.status === 200,
        }),
      }),
    },
  );

builder.relayMutationField(
  'noInput',
  null,
  {
    args: builder.args((t) => ({
      status: t.int(),
    })),
    resolve: async (_, args) => Promise.resolve({ status: args.status ?? 200 }),
  },
  {
    outputFields: (t) => ({
      itWorked: t.boolean({
        resolve: (parent) => parent.status === 200,
      }),
    }),
  },
);

builder.mutationField('exampleMutationReUse', (t) =>
  t.field({
    type: ExampleMutationPayload,
    args: {
      input: t.arg({
        required: true,
        type: ExampleMutationInput,
      }),
    },
    resolve: (_root, args) => {
      if (!args.input.clientMutationId) {
        throw new Error('clientMutationId is missing');
      }

      return Promise.resolve({ status: args.input.id === '123' ? 200 : 500 });
    },
  }),
);

builder.relayMutationField(
  'exampleWithDescriptions',
  {
    name: 'CustomInputName',
    argName: 'customInput',
    description: 'input type',
    inputFields: (t) => ({
      id: t.id({
        required: true,
      }),
    }),
  },
  {
    description: 'mutation field',
    resolve: (_root, args) => {
      if (!args.customInput.clientMutationId) {
        throw new Error('clientMutationId is missing');
      }

      return Promise.resolve({ status: args.customInput.id === '123' ? 200 : 500 });
    },
  },
  {
    name: 'CustomOutputName',
    description: 'output type',
    outputFields: (t) => ({
      itWorked: t.boolean({
        resolve: (parent) => parent.status === 200,
      }),
    }),
  },
);

export default builder.toSchema();
