import * as Rx from "rxjs";
import { of } from "rxjs";
import {
  Dictionary,
  DictionaryData,
  DictionaryKey,
  getDictionary,
} from "./run_dictionary";

interface CommandInfo {
  command: string;
  description: string;
}

export interface GameServices {
  getCommands: () => CommandInfo[];
  setIsMuted: (value: boolean) => void;
}

export abstract class ResponderModule {
  constructor(protected services: GameServices) {}
  public abstract readonly name: string;
  public abstract getResponse$(input: string): Rx.Observable<string | false>;
  public abstract keywordCheck(inputString: string): boolean;
}

function sample<T>(arr: Array<T>) {
  return arr[Math.floor(Math.random() * arr.length)];
}

class HelpResponder extends ResponderModule {
  name = "help";
  getResponse$() {
    return of(
      this.services
        .getCommands()
        .reduce<string>((final, { command, description }) => {
          const prefix = final ? final + "\n\n" : "";
          return prefix + `**${command}**:\n${description}`;
        }, "")
    );
  }
  public keywordCheck(inputString: string) {
    return inputString.match(/^help\b/) !== null;
  }
}
class RepeatResponder extends ResponderModule {
  name = "repeat";
  getResponse$(input: string) {
    return of(`here I will repeat ${input} as many times as you want`);
  }
  public keywordCheck(inputString: string) {
    return inputString.match(/^repeat\b/) !== null;
  }
}
class GibberishResponder extends ResponderModule {
  name = "default";
  private data: DictionaryData;
  private vocabulary: Dictionary;
  private dataKeys: DictionaryKey[];

  constructor(arg: GameServices) {
    super(arg);
    const { data, dictionary: vocabulary } = getDictionary();
    this.data = data;
    this.vocabulary = vocabulary;
    this.dataKeys = Object.keys(this.data);

    console.log({ data, vcblry: this.vocabulary });
  }
  getResponse$() {
    const randomKey = sample(this.dataKeys);
    const vocabular = this.data[randomKey];
    const randomString = sample(vocabular);

    const vocabParts = randomString.match(/\${([^}]+)}/g);
    vocabParts?.forEach(v => {
      const vPieces = v.match(/\${([^:]+):([^}]+)}/)
      console.log({ vPieces })
    })

    return of(randomString);
  }
  public keywordCheck() {
    return true;
  }
}
class MuteUnmuteResponder extends ResponderModule {
  name = "mute_unmute";
  private _isMuted = false;
  getResponse$(command: string) {
    command = command.toLowerCase();
    if (command !== "mute" && command !== "unmute") {
      return of(false as const);
    }

    this._isMuted = command === "mute";
    this.services.setIsMuted(this._isMuted);
    return of(this._isMuted ? "Muted." : "Unmuted.");
  }
  public keywordCheck(inputString: string) {
    return inputString.match(/^(mute|unmute)$/) !== null;
  }
}

export class Responder {
  private modules: ResponderModule[] = [];

  constructor(services: GameServices) {
    this.addResponder(new HelpResponder(services));
    this.addResponder(new MuteUnmuteResponder(services));
    this.addResponder(new RepeatResponder(services));
    this.addResponder(new GibberishResponder(services));
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
      return { command: m.name, description: "TBD" };
    });
  }
}
