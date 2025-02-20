# Add-GraphQL for Pothos

This plugin makes it easy to integrate GraphQL types from existing schemas into your Pothos API

It can be used for incremental migrations from nexus, graphql-tools, or any other JS/TS executable
schema.

## Install

```bash
yarn add @pothos/plugin-add-graphql
```

## Setup

```typescript
import AddGraphQLPlugin from '@pothos/plugin-add-graphql';

const builder = new SchemaBuilder({
  plugins: [AddGraphQLPlugin],
});
```

## Usage

There are 2 ways you can reference existing types.

- Adding types (or a whole external schema) when setting up the builder
- Adding types as Refs using new builder methods

### Adding types when creating your builder

Adding types to the builder will automatically include the types in your schema when it's built.
Types will only be added if no existing type of the same name is added to the builder before
building the schema.

Adding types recursively adds any other types that the added type depends in it's fields,
interfaces, or union members.

```ts
import { existingSchema } from './existing-schema-location';

const builder = new SchemaBuilder({
  plugins: [AddGraphQLPlugin],
  add: {
    // You can add individual types
    // This accepts Any GraphQLNamedType (Objects, Interface, Unions, Enums, Scalars, and InputObjects)
    types: [schema.getType('User'), schema.getType('Post')],
    // Or you can add an entire external schema
    schema: externalSchema,
  },
});
```

Adding types by themselves isn't very useful, so you'll probably want to be able to reference them
when defining fields in your schema. To do this, you can add them to the builders generic Types.

This currently only works for `Object`, `Interface`, and `Scalar` types. For other types, use the
builder methods below to create refs to the added types.

```ts
import { existingSchema } from './existing-schema-location';

const builder = new SchemaBuilder<{
  Objects: {
    User: UserType;
  };
  Interfaces: {
    ExampleInterface: { id: string };
  };
  Scalars: {
    DateTime: {
      Output: Date;
      Input: Date;
    };
  };
}>({
  plugins: [AddGraphQLPlugin],
  add: {
    types: [
      existingSchema.getType('User'),
      existingSchema.getType('ExampleInterface'),
      existingSchema.getType('DateTime'),
    ],
  },
});

builder.queryFields((t) => ({
  user: t.field({ type: 'User', resolve: () => getUser() }),
  exampleInterface: t.field({ type: 'ExampleInterface', resolve: () => getThings() }),
  now: t.field({ type: 'DateTime', resolve: () => new Date() }),
}));
```

### Adding types using builder methods

#### Objects

```ts
// Passing in a generic type is recommended to ensure type-safety
const UserRef = builder.addGraphQLObject<UserType>(
  existingSchema.getType('User') as GraphQLObjectType,
  {
    // Optionally you can override the types name
    name: 'AddedUser',
    // You can also pass in any other options you can define for normal object types
    description: 'This type represents Users',
  },
);

const PostRef = builder.addGraphQLObject<{
  id: string;
  title: string;
  content: string;
}>(existingSchema.getType('Post') as GraphQLObjectType, {
  fields: (t) => ({
    // remove existing title field from type
    title: null,
    // add new titleField
    postTitle: t.exposeString('title'),
  }),
});
```

You can then use the returned references when defining fields:

```ts
builder.queryFields((t) => ({
  posts: t.field({
    type: [PostRef],
    resolve: () => loadPosts(),
  }),
}));
```

### Interfaces

```ts
const NodeRef = builder.addGraphQLInterface<NodeShape>(
  existingSchema.getType('Node') as GraphQLInterfaceType,
  {
    // interface options
  },
);
```

### Unions

```ts
const SearchResult = builder.addGraphQLUnion<User | Post>(
  existingSchema.getType('SearchResult') as GraphQLUnionType,
  {
    // union options
  },
);
```

### Enums

```ts
const OrderBy = builder.addGraphQLEnum<'Asc' | 'Desc'>(
  existingSchema.getType('OrderBy') as GraphQLEnumType,
  {
    // enum options
  },
);
```

### Input objects

```ts
const PostFilter = builder.addGraphQLInput<{ title?: string, tags? string[] }>(
  existingSchema.getType('PostFilter') as GraphQLInputObjectType,
  {
    // input options
  },
);
```

### Scalars

This plugin does not add a new method for scalars, because Pothos already has a method for adding
existing scalar types.

```ts
builder.addScalarType('DateTime', existingSchema.getType('DateTime') as GraphQLScalar, {
  // scalar options
});
```
