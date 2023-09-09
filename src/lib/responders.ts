import * as Rx from "rxjs";
import { map } from "rxjs/operators";
import { GameServices, ResponderModule } from ".";
import { Vocabulary, getDictionary } from "./dictionary";
import { BatcaveResponder as BatcaveGame } from "./games";
import { ofStatic, sample, shuffle } from "./utils";

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
  getResponse$(input: string) {
    const voices = this.services.voices.getAllVoices();

    let locale: string | null = null;
    if (input.match(/^([gG]et_voices|[vV]oices) [a-z][a-z]-[A-Z][A-Z]$/)) {
      locale = input.replace(
        /^(?:[gG]et_voices|[vV]oices) ([a-z][a-z]-[A-Z][A-Z])$/,
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
  keywordCheck(input: string) {
    return input.toLowerCase().match(/^(get_voices|voices)\b/) !== null;
  }
}

class SetVoiceResponder extends ResponderModule {
  name = "set_voice";
  description =
    "Set the voice you hear that read the things. Type 'set_voice user 2' or 'set_voice computer 1'";
  getResponse$(input: string) {
    const voices = this.services.voices.getAllVoices();

    const voiceToChange = input
      .toLowerCase()
      .replace(/^set_voice (user|computer).*$/, "$1") as "user" | "computer";
    const voiceIndex = parseInt(
      input.toLowerCase().replace(/^set_voice (?:user|computer) (\d+)/, "$1")
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
  keywordCheck(input: string) {
    return input.toLowerCase().match(/^set_voice\b/) !== null;
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
  name = "repeat_x";
  description = "This repeats something X number of times.";
  getResponse$(input: string) {
    let isHelp = input.toLowerCase().match(/^repeat_x$/) !== null;
    const repeatTimes = parseInt(
      input.toLowerCase().replace(/^repeat_x (\d+)/, "$1")
    );
    if (isNaN(repeatTimes)) {
      isHelp = true;
    }
    if (isHelp) {
      return ofStatic("type 'repeat_x <number> thing-to-repeat'");
    }

    const whatToRepeat = input
      .toLowerCase()
      .replace(/^repeat_x \d+ (.*$)/, "$1");

    let result = "";
    for (let repeats = 0; repeats < repeatTimes; repeats++) {
      result += " " + whatToRepeat;
    }
    return ofStatic(result);
  }
  public keywordCheck(input: string) {
    return input.toLowerCase().match(/^repeat_x (\d+) /) !== null;
  }
}

class TimerResponder extends ResponderModule {
  name = "timer";
  description = "Set a timer";
  constructor(arg: GameServices) {
    super(arg);
  }
  public getResponse$(input: string) {
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
  public keywordCheck(input: string) {
    return input.toLowerCase().match(/^timer\b/) !== null;
  }
}

class PlayResponder extends ResponderModule {
  name = "play";
  description = "Type the name of a game to play. Try: 'play batcave'";

  private games: ResponderModule[];
  private activeGame: ResponderModule | null = null;

  constructor(arg: GameServices) {
    super(arg);
    this.games = [new BatcaveGame(arg)];
  }

  public getResponse$(input: string) {
    let gameResponse$: Rx.Observable<string> | null = null;
    const help$ = ofStatic("Type: 'play batcave'");
    const command = input.toLowerCase().replace(/^(play|game) /, "");
    const newActiveGame = this.games.find((responder) =>
      responder.keywordCheck(command)
    );

    // allow reset with: 'game batcave reset'
    if (input.toLowerCase().match(/(play|game) reset\b/)) {
      // FIXME find game in collection and reset the object
      const reset$ = ofStatic(`${command} done`);
      return reset$;
    }

    if (newActiveGame && !this.activeGame) {
      this.activeGame = newActiveGame;
    }

    gameResponse$ = this.activeGame?.getResponse$(command) ?? null;

    // keep chat in game mode if any known game is "active"
    this._isActive = Boolean(this.games.find(({ isActive }) => isActive));

    return gameResponse$ ?? help$;
  }
  public keywordCheck(input: string): boolean {
    return input.toLowerCase().match(/^(play|game)\b/) !== null;
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
    new PlayResponder(services),
    new GibberishResponder(services), // must be last
  ];
};
