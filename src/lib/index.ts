import * as Rx from "rxjs";
import type { createUsers } from "./user";
import { VoiceServices } from "./voices";

export abstract class ResponderModule {
  protected _isActive = false;
  constructor(protected services: GameServices) {}
  set isActive(val: boolean) {
    this._isActive = val;
  }
  get isActive() {
    return this._isActive;
  }
  public abstract readonly name: string;
  public abstract readonly description: string;
  public abstract getResponse$(input: string): Rx.Observable<string>;
  public abstract keywordCheck(inputString: string): boolean;
}

export interface ResponderServices {
  getRespondersByKeyword: (input: string) => ResponderModule[];
  getCommands: () => CommandInfo[];
}

export interface CommandInfo {
  command: string;
  description: string;
}

export interface GameServices {
  getCommands: () => CommandInfo[];
  setIsMuted: (value: boolean) => void;
  setComputerVoice: (voice: SpeechSynthesisVoice) => void;
  setUserVoice: (voice: SpeechSynthesisVoice) => void;
  voices: VoiceServices;
}

export interface GameDeps {
  synth: {
    cancel: SpeechSynthesis["cancel"];
    speak: SpeechSynthesis["speak"];
    getVoices: SpeechSynthesis["getVoices"];
  };
  users: ReturnType<typeof createUsers>;
  voices: VoiceServices;
}

export interface BrowserServices {
  gameLaunch$: Rx.Observable<GraphicsGame>;
  gameExit$: Rx.Observable<undefined>;
}

export interface GraphicsGame {
  start: () => void;
  stop: () => void;
}
