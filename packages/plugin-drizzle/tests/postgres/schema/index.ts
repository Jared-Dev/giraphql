import { type Column, not, sql } from 'drizzle-orm';
import builder from '../builder';
import { db } from '../db';

builder.drizzleObject('users', {
  name: 'User',
  // Default selection when query users (optional, defaults to all columns)
  select: {
    columns: {
      id: true,
    },
    with: {
      invitee: {
        columns: {
          name: true,
        },
      },
    },
  },
  fields: (t) => ({
    email: t.string({
      resolve: (user) => `${user.lowercase.replaceAll(' ', '-')}@example.com`,
      // field level selects can be merged in (only queried when the field is requested)
      // combines with selections from object level
      select: {
        // with: {
        //   posts: true,
        // },
        columns: {
          invitedBy: true,
        },
        extras: (user: Record<string, Column>) => ({
          lowercase: sql<string>`lower(${user.name})`.as('lowercase'),
        }),
      },
    }),
    // column values can be exposed even if they are not in the default selection (will be selected automatically)
    name: t.exposeString('name'),
    posts: t.relation('posts', {
      args: {
        limit: t.arg.int(),
        offset: t.arg.int(),
        oldestFirst: t.arg.boolean(),
      },
      // use args to modify how a relation is queried
      query: (args) => ({
        limit: args.limit ?? 10,
        offset: args.offset ?? 0,
        where: (post, { eq }) => not(eq(post.id, 34)),
        orderBy: (post, ops) => (args.oldestFirst ? ops.asc(post.id) : ops.desc(post.id)),
      }),
      // relation available to other plugins even when selections are at the field level
      // authScopes: (user) => user.posts.length > 0,
      //                           ^?
    }),
    invitee: t.relation('invitee'),
    // postsConnection: t.relatedConnection('posts', {
    //   description: "A connection to a user's posts",
    //   resolve: (user) => user.posts,
    // }),
  }),
});

builder.queryField('user', (t) =>
  t.drizzleField({
    type: 'users',
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (query, _root, args, _ctx, _info) => {
      const drizzleQuery = db.query.users.findFirst({
        ...query,
        where: (user, { eq }) => eq(user.id, args.id),
      });

      // console.dir(query, { depth: null });
      const result = await drizzleQuery;

      return result;
    },
  }),
);

builder.drizzleObject('posts', {
  name: 'Post',
  select: {
    columns: {
      id: true,
    },
  },
  fields: (t) => ({
    id: t.exposeID('id'),
    content: t.exposeString('content'),
    author: t.relation('author'),
  }),
});

builder.queryType({});

export const schema = builder.toSchema();
