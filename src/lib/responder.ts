import * as Rx from "rxjs";
import { of } from "rxjs";
import { Dictionary, Vocabulary, getDictionary } from "./dictionary";
import { sample, shuffle } from "./utils";

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
  public abstract readonly description: string;
  public abstract getResponse$(input: string): Rx.Observable<string | false>;
  public abstract keywordCheck(inputString: string): boolean;
}

class HelpResponder extends ResponderModule {
  name = "help";
  description = "This gets you help information."
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
    return inputString.match(/^help|what$/) !== null;
  }
}
class RepeatResponder extends ResponderModule {
  name = "repeat";
  description = "This repeats something."
  getResponse$(input: string) {
    return of(`here I will repeat ${input} as many times as you want`);
  }
  public keywordCheck(inputString: string) {
    return inputString.match(/^repeat\b/) !== null;
  }
}
class GibberishResponder extends ResponderModule {
  name = "default";
  description = "Mad-libs like gibberish"
  private data: Dictionary;
  private vocabulary: Vocabulary;

  constructor(arg: GameServices) {
    super(arg);
    const { dictionary, vocabulary } = getDictionary();
    this.data = dictionary;
    this.vocabulary = vocabulary;
  }
  getResponse$(rawInput: string) {
    const input = rawInput.trim().toLowerCase();

    // search the dictionary data in a random order
    const texts = shuffle(Object.values(this.data).flatMap((text) => text));
    let source: string | undefined;
    for (const s of texts) {
      console.log(`match? [${s}] ${input}: ${s.toLowerCase().includes(input)}`);
      if (s.toLowerCase().includes(input)) {
        // match of user input
        console.log(`matched text ${input} in ${s}`);
        source = s;
        break;
      }
    }
    if (!source) {
      source = texts[0];
    }

    // replace template
    const matches = source.match(/\${\S+:[^}]+}/g);
    if (matches) {
      for (const mI in matches) {
        const m = matches[mI];
        const subMatches = m.match(/\${(\S+):([^}]+)}/);
        if (subMatches) {
          const [kind, thing] = subMatches.splice(1, 2);
          const nextThing = thing.toLowerCase().includes(input)
            ? thing
            : sample(this.vocabulary[kind]);

          console.log(`replace ${m} with ${nextThing}`);
          source = source.replace(m, nextThing);
        }
      }
    }

    return of(source);
  }
  public keywordCheck() {
    return true;
  }
}
class MuteUnmuteResponder extends ResponderModule {
  name = "mute_unmute";
  description = "Makes the speaking that you hear stop or start again"
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
      return { command: m.name, description: m.description };
    });
  }
}
