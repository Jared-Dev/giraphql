import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { schema } from './schema';

const yoga = createYoga({
  schema,
  maskedErrors: false,
});

const server = createServer(yoga);

const port = 3000;
server.listen(port);
