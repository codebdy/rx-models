export class Condition {
  private _field: string;
  private _operator: string;
  private _value: [] | string | number | boolean;
  private _belongsToRelation: string;
  private _model: string;
  private _modelAlias: string;

  constructor(keyStr: string, value: any, model: string, modelAlias: string) {
    this._model = model;
    this._modelAlias = modelAlias;
    const keyArray = keyStr.split('@');
    if (keyArray.length > 0) {
      this._field = keyArray[0].trim();
      const fieldNameArray = this._field.split('.');
      if (fieldNameArray.length > 1) {
        this._field = fieldNameArray[1].trim();
        this._belongsToRelation = fieldNameArray[0].trim();
      }
    }

    this._operator =
      keyArray.length > 1 && keyArray[1] ? keyArray[1].trim() : '=';
    this._value = value;
  }

  set relationAlias(alias: string) {
    this._modelAlias = alias;
  }

  get field() {
    return this._modelAlias + '.' + this._field;
  }

  get model() {
    return this._model;
  }

  get modelAlias() {
    return this._modelAlias;
  }

  /**
   * 所属关联，如果没有所属关联，返回undefined
   */
  get belongsToRelationName() {
    return this._belongsToRelation;
  }

  get operator() {
    return this._operator;
  }

  get value() {
    return this._value;
  }
}
