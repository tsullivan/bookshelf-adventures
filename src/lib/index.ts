import * as Rx from "rxjs";
import { GameServices } from "./services";

export abstract class ResponderModule {
  protected _isActive = false;

  constructor(protected services: GameServices) {}

  set isActive(val: boolean) {
    this._isActive = val;
  }
  get isActive() {
    return this._isActive;
  }

  public abstract readonly name: string;
  public abstract readonly description: string;
  public abstract getResponse$(input: string): Rx.Observable<string>;
  public abstract keywordCheck(inputString: string): boolean;
}
