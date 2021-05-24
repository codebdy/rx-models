export class ConditionMeta {
  private _field: string;
  private _operator: string;
  private _value: [] | string | number | boolean;
  constructor(keyStr: string, value: any) {
    const keyArray = keyStr.split('@');
    if (keyArray.length > 0) {
      this._field = keyArray[0].trim();
    }

    this._operator = keyArray.length > 1 ? keyArray.length[1].trim() : '=';
    this._value = value;
  }

  get field() {
    return this._field;
  }

  get operator() {
    return this._operator;
  }

  get value() {
    return this._value;
  }
}
