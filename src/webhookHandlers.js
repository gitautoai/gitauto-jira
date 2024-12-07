import Resolver from '@forge/resolver';

const resolver = new Resolver();

resolver.define('issue-created', async ({ payload }) => {
  console.log('Issue created:', payload);
  // Add your logic for handling issue creation
});

resolver.define('issue-updated', async ({ payload }) => {
  console.log('Issue updated:', payload);
  // Add your logic for handling issue updates
});

resolver.define('issue-deleted', async ({ payload }) => {
  console.log('Issue deleted:', payload);
  // Add your logic for handling issue deletions
});

export default resolver;
