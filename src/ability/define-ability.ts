import { defineAbility } from '@casl/ability';

export default defineAbility((can, cannot) => {
  can('read', 'Post');
  cannot('delete', 'Post', { published: true });
});
