import * as Rx from "rxjs";
import { map } from "rxjs/operators";
import { Vocabulary, getDictionary } from "./dictionary";
import { GameServices } from "./services";
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

class GibberishResponder extends ResponderModule {
  _vocabulary: Vocabulary;
  _isGibberish = true;
  name = "default";
  description =
    `Mad-libs like gibberish. Type 'gibberish_` +
    `${this._isGibberish ? "off" : "on"}'` +
    ` to control the gibberish. Gibberish is: ` +
    `${this._isGibberish ? "on" : "off"}`;
  constructor(arg: GameServices) {
    super(arg);
    const { vocabulary } = getDictionary();
    console.log(vocabulary);
    this._vocabulary = vocabulary;
  }
  getResponse$(rawInput: string) {
    const input = rawInput.trim().toLowerCase();
    let _isControlStatement = false;
    if (input === "gibberish_off") {
      this._isGibberish = false;
      _isControlStatement = true;
    }
    if (input === "gibberish_on") {
      this._isGibberish = true;
      _isControlStatement = true;
    }
    if (_isControlStatement) {
      return ofStatic(`gibberish controls set to ${this._isGibberish}`);
    }

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
            : sample(this._vocabulary[kind]);

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
  public keywordCheck(rawInput: string) {
    const input = rawInput.toLowerCase();
    return input.match(/^(help|what)\b/) !== null;
  }
}

class MuteUnmuteResponder extends ResponderModule {
  name = "mute_unmute";
  description = "Makes the speaking that you hear stop or start again";
  getResponse$(command: string) {
    command = command.toLowerCase();

    const isMuted = command === "mute";
    this.services.setIsMuted(isMuted);
    return ofStatic(isMuted ? "Muted." : "Unmuted.");
  }
  public keywordCheck(rawInput: string) {
    const input = rawInput.toLowerCase();
    return input.match(/^(mute|unmute)$/) !== null;
  }
}

class GetVoicesResponder extends ResponderModule {
  name = "get_voices";
  description = "Get a list of the voices that can be used to hear the text";
  getResponse$(rawInput: string) {
    const voices = this.services.voices.getAllVoices();

    let locale: string | null = null;
    if (rawInput.match(/^(get_voices|voices) [a-z][a-z]-[A-Z][A-Z]$/)) {
      locale = rawInput.replace(
        /^(?:get_voices|voices) ([a-z][a-z]-[A-Z][A-Z])$/,
        "$1"
      );
    }

    const staticString = voices
      .map((voice, index) => {
        if (voice.lang === locale || locale == null) {
          return `[${index + 1}] ${voice.name}: (${voice.lang})`;
        }
        return false;
      })
      .filter(Boolean)
      .join("  \n");

    return ofStatic(staticString);
  }
  keywordCheck(rawInput: string) {
    const input = rawInput.toLowerCase();
    return input.match(/^(get_voices|voices)\b/) !== null;
  }
}

class SetVoiceResponder extends ResponderModule {
  name = "set_voice";
  description =
    "Set the voice you hear that read the things. Type 'set_voice user 2' or 'set_voice computer 1'";
  getResponse$(input: string) {
    const voices = this.services.voices.getAllVoices();

    const voiceToChange = input.replace(
      /^set_voice (user|computer).*$/,
      "$1"
    ) as "user" | "computer";
    const voiceIndex = parseInt(
      input.replace(/^set_voice (?:user|computer) (\d+)/, "$1")
    );
    const newVoice = voices[voiceIndex - 1] as SpeechSynthesisVoice | undefined;

    if (newVoice) {
      if (voiceToChange === "computer") {
        this.services.setComputerVoice(newVoice);
        return ofStatic(`Set computer voice to ${newVoice.name}`);
      }
      if (voiceToChange === "user") {
        this.services.setUserVoice(newVoice);
        return ofStatic(`Set user voice to ${newVoice.name}`);
      }
    }

    return ofStatic(
      "type 'set_voice user|computer <number>'. type 'get_voices' to see the voice numbers"
    );
  }
  keywordCheck(rawInput: string) {
    const input = rawInput.toLowerCase();
    return input.match(/^set_voice\b/) !== null;
  }
}

class RepeatResponder extends ResponderModule {
  name = "repeat";
  description = "This repeats something.";
  getResponse$(input: string) {
    return ofStatic(input.replace(/^(repeat|say) /, ""));
  }
  public keywordCheck(rawInput: string) {
    const input = rawInput.toLowerCase();
    return input.match(/^(repeat|say)\b/) !== null;
  }
}

class RepeatXResponder extends ResponderModule {
  name = "repeatx";
  description = "This repeats something X number of times.";
  getResponse$(input: string) {
    let isHelp = input.match(/^repeatx$/) !== null;
    const repeatTimes = parseInt(input.replace(/^repeatx (\d+)/, "$1"));
    if (isNaN(repeatTimes)) {
      isHelp = true;
    }
    if (isHelp) {
      return ofStatic("type 'repeatx <number> thing-to-repeat'");
    }

    const whatToRepeat = input.replace(/^repeatx \d+ (.*$)/, "$1");
    let result = "";
    for (let repeats = 0; repeats < repeatTimes; repeats++) {
      result += " " + whatToRepeat;
    }
    return ofStatic(result);
  }
  public keywordCheck(rawInput: string) {
    const input = rawInput.toLowerCase();
    return input.match(/^repeatx (\d+) /) !== null;
  }
}

class TimerResponder extends ResponderModule {
  name = "timer";
  description = "Set a timer";
  constructor(arg: GameServices) {
    super(arg);
  }
  public getResponse$(input: string): Rx.Observable<string | false> {
    let isHelp = input.match(/^timer$/) !== null;
    const timeoutTime = parseInt(input.replace(/^timer (\d+)s/, "$1"));
    if (isNaN(timeoutTime)) {
      isHelp = true;
    }
    if (isHelp) {
      return ofStatic("type 'timer 3s something-to-say'");
    }

    const thingToSay = input.replace(/^timer \d+s (.*)$/, "$1");
    return Rx.timer(timeoutTime * 1000).pipe(map(() => thingToSay));
  }
  public keywordCheck(rawInput: string) {
    const input = rawInput.toLowerCase();
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
