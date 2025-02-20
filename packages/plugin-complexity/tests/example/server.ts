import { createTestServer } from '@pothos/test-utils';
import type { ComplexityResult } from '../../src';
import schema from './schema';

const server = createTestServer({
  schema,
  context: (): { complexity: ComplexityResult } => ({
    complexity: {
      depth: 5,
      breadth: 10,
      complexity: 200,
    },
  }),
});

server.listen(3000, () => {
  console.log('🚀 Server started at http://127.0.0.1:3000');
});
