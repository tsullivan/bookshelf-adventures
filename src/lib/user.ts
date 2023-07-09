export class User {
  private _name: string | null = null;

  get name(): string {
    if (this._name == null) {
      throw new Error("User not initialized");
    }
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }
}
