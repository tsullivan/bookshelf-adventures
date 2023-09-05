import * as Rx from "rxjs";
import { of } from "rxjs";
import { getDictionary } from "./dictionary";
import { CommandInfo, GameServices } from "./game";
import { sample, shuffle } from "./utils";

export abstract class ResponderModule {
  constructor(protected services: GameServices) {}
  public abstract readonly name: string;
  public abstract readonly description: string;
  public abstract getResponse$(input: string): Rx.Observable<string | false>;
  public abstract keywordCheck(inputString: string): boolean;
}

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

/** Responder Modules */

class HelpResponder extends ResponderModule {
  name = "help";
  description = "This gets you help information.";
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
    return inputString.match(/^(help|what)$/) !== null;
  }
}
class MuteUnmuteResponder extends ResponderModule {
  name = "mute_unmute";
  description = "Makes the speaking that you hear stop or start again";
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
class GetVoicesResponder extends ResponderModule {
  name = "get_voices";
  description = "Get a list of the voices that can be used to hear the text";
  getResponse$() {
    const voices = this.services.getVoices();
    return of(voices.map((voice) => `${voice.name}: (${voice.lang})`).join());
  }
  keywordCheck(inputString: string) {
    return inputString.match(/^(get_voices|voices)$/) !== null;
  }
}
class SetVoiceResponder extends ResponderModule {
  name = "set_voice";
  description = "Set the voice you hear that read the things you type";
  getResponse$(input: string) {
    const voiceIndex = parseInt(input.replace(/^set_voice (\d+) .*$/, "$1"));
    const voices = this.services.getVoices();
    const newVoice = voices[voiceIndex];
    this.services.setUserVoice(newVoice);
    return of(`Set user voice to ${newVoice.name}`);
  }
  keywordCheck(inputString: string) {
    return inputString.match(/^set_voice \d+$/) !== null;
  }
}
class RepeatResponder extends ResponderModule {
  name = "repeat";
  description = "This repeats something.";
  getResponse$(input: string) {
    return of(input.replace(/^repeat /, ""));
  }
  public keywordCheck(inputString: string) {
    return inputString.match(/^repeat\b/) !== null;
  }
}
class RepeatXResponder extends ResponderModule {
  name = "repeatx";
  description = "This repeats something X number of times.";
  getResponse$(input: string) {
    const repeatTimes = parseInt(input.replace(/^repeatx (\d+) .*$/, "$1"));
    const whatToRepeat = input.replace(/^repeatx \d+ (.*$)/, "$1");
    let result = "";
    for (let repeats = 0; repeats < repeatTimes; repeats++) {
      result += " " + whatToRepeat;
    }
    return of(result);
  }
  public keywordCheck(inputString: string) {
    return inputString.match(/^repeatx (\d+) /) !== null;
  }
}
class GibberishResponder extends ResponderModule {
  name = "default";
  description = "Mad-libs like gibberish";
  constructor(arg: GameServices) {
    super(arg);
  }
  getResponse$(rawInput: string) {
    const input = rawInput.trim().toLowerCase();
    const { vocabulary, dictionary } = getDictionary();
    // search the dictionary data in a random order
    const texts = shuffle(Object.values(dictionary).flatMap((text) => text));
    let source: string | undefined;
    for (const s of texts) {
      if (s.toLowerCase().includes(input)) {
        // match of user input
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
            : sample(vocabulary[kind]);

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
