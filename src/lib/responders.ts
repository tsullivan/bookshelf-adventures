import * as Rx from "rxjs";
import { map } from "rxjs/operators";
import { Vocabulary, getDictionary } from "./dictionary";
import { GameServices } from "./game";
import { sample, shuffle } from "./utils";

export abstract class ResponderModule {
  constructor(protected services: GameServices) {}
  public abstract readonly name: string;
  public abstract readonly description: string;
  public abstract getResponse$(input: string): Rx.Observable<string | false>;
  public abstract keywordCheck(inputString: string): boolean;
}

const ofStatic = (input: string) => {
  return Rx.of(input);
};

class HelpResponder extends ResponderModule {
  name = "help";
  description = "This gets you help information.";
  getResponse$() {
    return ofStatic(
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

    this._isMuted = command === "mute";
    this.services.setIsMuted(this._isMuted);
    return ofStatic(this._isMuted ? "Muted." : "Unmuted.");
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
    return ofStatic(voices.map((voice) => `${voice.name}: (${voice.lang})`).join());
  }
  keywordCheck(inputString: string) {
    return inputString.match(/^(get_voices|voices)$/) !== null;
  }
}

class SetVoiceResponder extends ResponderModule {
  name = "set_voice";
  description = "Set the voice you hear that read the things";
  getResponse$(input: string) {
    // TODO: support set_my_voice, set_shelfie_voice
    const voiceIndex = parseInt(input.replace(/^set_voice (\d+) .*$/, "$1"));
    const voices = this.services.getVoices();
    const newVoice = voices[voiceIndex];
    this.services.setUserVoice(newVoice);
    return ofStatic(`Set user voice to ${newVoice.name}`);
  }
  keywordCheck(inputString: string) {
    return inputString.match(/^set_voice \d+$/) !== null;
  }
}

class RepeatResponder extends ResponderModule {
  name = "repeat";
  description = "This repeats something.";
  getResponse$(input: string) {
    return ofStatic(input.replace(/^repeat /, ""));
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
    return ofStatic(result);
  }
  public keywordCheck(inputString: string) {
    return inputString.match(/^repeatx (\d+) /) !== null;
  }
}

class GibberishResponder extends ResponderModule {
  name = "default";
  description = "Mad-libs like gibberish";
  vocabulary: Vocabulary;
  constructor(arg: GameServices) {
    super(arg);
    const { vocabulary } = getDictionary();
    console.log(vocabulary);
    this.vocabulary = vocabulary;
  }
  getResponse$(rawInput: string) {
    // TODO: allow gibberish to be turned off
    const input = rawInput.trim().toLowerCase();
    const { dictionary } = getDictionary();
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
            : sample(this.vocabulary[kind]);

          source = source.replace(m, nextThing);
        }
      }
    }
    return ofStatic(source);
  }
  public keywordCheck() {
    return true;
  }
}

class TimerResponder extends ResponderModule {
  name = "timer";
  description = "Set a timer";
  constructor(arg: GameServices) {
    super(arg);
  }
  public getResponse$(input: string): Rx.Observable<string | false> {
    return Rx.timer(3000).pipe(map(() => input));
  }
  public keywordCheck(input: string) {
    return input.match(/^timer\b/) !== null;
  }
}

export const createResponders = (services: GameServices) => {
  return [
    new HelpResponder(services),
    new MuteUnmuteResponder(services),
    new RepeatResponder(services),
    new RepeatXResponder(services),
    new GetVoicesResponder(services),
    new SetVoiceResponder(services),
    new TimerResponder(services),
    new GibberishResponder(services), // must be last
  ];
};
