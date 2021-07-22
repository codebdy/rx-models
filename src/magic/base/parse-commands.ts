import { DirectiveMeta } from 'src/directive/directive.meta';

function stringArrayToCommands(strArray: string[]): DirectiveMeta[] {
  const commands = [];
  for (const commandStr of strArray) {
    commands.push(new DirectiveMeta(commandStr));
  }
  return commands;
}

export function parseCommands(str: string): [string?, DirectiveMeta[]?] {
  const strArray: string[] = str.split('@');
  const key = strArray[0]?.trim();
  return [key, stringArrayToCommands(strArray.splice(1))];
}
