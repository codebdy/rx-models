import { CommandMeta } from './command-meta';

function stringArrayToCommands(strArray: string[]): CommandMeta[] {
  const commands = [];
  for (const commandStr of strArray) {
    commands.push(new CommandMeta(commandStr));
  }
  return commands;
}

export function parseCommands(str: string): [string?, CommandMeta[]?] {
  const strArray: string[] = str.split('@');
  const key = strArray[0]?.trim();
  return [key, stringArrayToCommands(strArray.splice(1))];
}
