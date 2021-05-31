import { AbilityBuilder, Ability } from '@casl/ability';

export default function defineAbilityFor(user) {
  const { can, rules } = new AbilityBuilder(Ability);

  can('read', 'Article');
  can('update', 'Article', ['title', 'description'], { authorId: user.id });

  if (user.isModerator) {
    can('update', 'Article', ['published']);
  }

  return new Ability(rules);
}
