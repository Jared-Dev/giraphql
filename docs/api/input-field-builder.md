---
name: InputFieldBuilder
menu: Api
---

# InputFieldBuilder

## `field(options)`

- `options`: \[`FieldOptions`\]

### FieldOptions

```typescript
type FieldOptions = {
  type: ReturnType;
  required?: boolean;
  description?: string;
  deprecationReason?: string;
};
```

- `type`: [Type Parameter](input-field-builder.md#type-parameter)
- `required`: boolean, defaults to `false`, unless overwritten in SchemaBuilder see

  [Changing Default Nullability](../guide/changing-default-nullability.md).

- `description`: string
- `defaultValue`: default value for field, type based on `type` option.

### Type Parameter

A Type Parameter for a Field can be any `InputTypeRef` returned by one of the
[`SchemaBuilder`](./schema-builder.md) methods for defining an `InputObject`, `Enum`, or `Scalar`, a
ts enum used to define a graphql enum type, or a string that corresponds to one of they keys of the
`Scalars` object defined in [`SchemaTypes`](./schema-builder.md#schematypes).

## helpers

A set of helpers for creating scalar fields. This work the same as `field`, but omit the `type`
field from options.

### Scalars

- `string(options)`
- `id(options)`
- `boolean(options)`
- `int(options)`
- `float(options)`
- `stringList(options)`
- `idList(options)`
- `booleanList(options)`
- `intList(options)`
- `floatList(options)`
