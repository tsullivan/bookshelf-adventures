export class User {
  private _name: string | null = null;

  get name(): string  | null {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }
}
