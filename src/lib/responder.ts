import type {
  CommandInfo,
  GameServices,
  ResponderModule,
  ResponderServices,
} from ".";
import { createResponders } from "./responders";

export class Responder implements ResponderServices {
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

  public getRespondersByKeyword(userInput: string): ResponderModule[] {
    return this.modules.filter((res) => {
      return res.keywordCheck(userInput);
    });
  }

  public getActiveResponders(): ResponderModule[] {
    return this.modules.filter((res: ResponderModule) => {
      return res.isActive === true;
    });
  }

  public getCommands(): CommandInfo[] {
    return this.modules.map((m) => {
      return { command: m.name, description: m.description };
    });
  }
}
