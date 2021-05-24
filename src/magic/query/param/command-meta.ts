export class CommandMeta {
  private _name: string;
  private _params: string[] = [];

  constructor(commandStr: string) {
    const takenArray = /\S*(\S*)/.exec(commandStr);
    if (takenArray.length > 0) {
      this._name = takenArray[0].trim();
    }

    if (takenArray.length > 2) {
      this._params = takenArray[1].split(',').map((token) => token.trim());
    }
  }

  get name() {
    return this._name;
  }

  get params() {
    return this._params;
  }
}
