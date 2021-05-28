import { Command } from './command';

function stringArrayToCommands(strArray: string[]): Command[] {
  const commands = [];
  for (const commandStr of strArray) {
    commands.push(new Command(commandStr));
  }
  return commands;
}

export function parseCommands(str: string): [string?, Command[]?] {
  const strArray: string[] = str.split('@');
  const key = strArray[0]?.trim();
  return [key, stringArrayToCommands(strArray.splice(1))];
}
