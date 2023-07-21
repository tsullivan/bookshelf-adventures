import * as Rx from "rxjs";
import { map, of } from "rxjs";

interface ResponderModule {
  name: string;
  getResponse$: (input: string) => Rx.Observable<string | false>;
}

class HelpModule implements ResponderModule {
  name = "help";
  getResponse$ = (input: string) => {
    return of(`hello ${input} i am ${this.name}`);
  };
}
class RepeatModule implements ResponderModule {
  name = "repeat";
  getResponse$ = (input: string) => {
    return of(`hello ${input} i am ${this.name}`);
  };
}
class GibberishModule implements ResponderModule {
  name = "default";
  getResponse$ = (input: string) => {
    return of(`hello ${input} i am ${this.name}`);
  };
}
class NeverModule implements ResponderModule {
  name = "never";
  getResponse$ = () => of(false as const);
}

export class Responder {
  private modules: ResponderModule[] = [];

  constructor() {
    this.addModule(new HelpModule());
    this.addModule(new RepeatModule());
    this.addModule(new GibberishModule());
    this.addModule(new NeverModule());
  }

  private addModule(module: ResponderModule) {
    const nameExists = this.modules.find(({ name }) => module.name === name);
    if (nameExists) {
      throw new Error(`Responder with name ${module.name} already exists!`);
    }

    this.modules.push(module);
  }

  public getResponse$(input: string): Rx.Observable<string> {
    const responses$ = this.modules.map((m) => m.getResponse$(input));
    return Rx.combineLatest(responses$).pipe(
      map((outputs) => outputs.filter(Boolean).join("\n"))
    );
  }
}
