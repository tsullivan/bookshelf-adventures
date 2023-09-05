import { CommandInfo, GameServices } from "./game";
import {
  GetVoicesResponder,
  GibberishResponder,
  HelpResponder,
  MuteUnmuteResponder,
  RepeatResponder,
  RepeatXResponder,
  ResponderModule,
  SetVoiceResponder,
} from "./responders";

export class Responder {
  private modules: ResponderModule[] = [];

  constructor(services: GameServices) {
    this.addResponder(new HelpResponder(services));
    this.addResponder(new MuteUnmuteResponder(services));
    this.addResponder(new RepeatResponder(services));
    this.addResponder(new RepeatXResponder(services));
    this.addResponder(new GetVoicesResponder(services));
    this.addResponder(new SetVoiceResponder(services));
    this.addResponder(new GibberishResponder(services)); // must be last
  }

  private addResponder(module: ResponderModule) {
    const nameExists = this.modules.find(({ name }) => module.name === name);
    if (nameExists) {
      throw new Error(`Responder with name ${module.name} already exists!`);
    }
    this.modules.push(module);
  }

  public getResponders(userInput: string): ResponderModule[] {
    return this.modules.filter((res) => {
      return res.keywordCheck(userInput);
    });
  }

  public getCommands(): CommandInfo[] {
    return this.modules.map((m) => {
      return { command: m.name, description: m.description };
    });
  }
}
