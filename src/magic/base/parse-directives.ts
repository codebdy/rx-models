import { DirectiveMeta } from 'directive/directive.meta';

function stringArrayToDirectives(strArray: string[]): DirectiveMeta[] {
  const directives = [];
  for (const directiveStr of strArray) {
    directives.push(new DirectiveMeta(directiveStr));
  }
  return directives;
}

export function parseDirectives(str: string): [string?, DirectiveMeta[]?] {
  const strArray: string[] = str.split('@');
  const key = strArray[0]?.trim();
  return [key, stringArrayToDirectives(strArray.splice(1))];
}
