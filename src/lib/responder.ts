import { CommandInfo, GameServices } from "./services";
import { ResponderModule, createResponders } from "./responders";

export class Responder {
  private modules: ResponderModule[] = [];

  constructor(services: GameServices) {
    createResponders(services).forEach((responder) => {
      this.addResponder(responder);
    });
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
