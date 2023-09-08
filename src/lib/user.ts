import { GameServices } from "./services";

interface UserDeps {
  synth: {
    getVoices: SpeechSynthesis["getVoices"];
    speak: SpeechSynthesis["speak"];
  };
  voices: GameServices["voices"];
}

export class User {
  private _name: string | null = null;
  private _voice: SpeechSynthesisVoice | null = null;

  constructor(private deps: UserDeps) {}

  get name(): string | null {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  getVoice(): SpeechSynthesisVoice | null {
    return this._voice;
  }

  setVoice(voice: SpeechSynthesisVoice) {
    this._voice = voice;
  }

  speak(input: string) {
    if (!this._voice) {
      throw new Error(`user voice not set!`);
    }
    const utterance = new SpeechSynthesisUtterance(input);
    utterance.voice = this._voice;
    this.deps.synth.speak(utterance);
  }
}

export const createUsers = (deps: UserDeps) => {
  const computer_1 = new User(deps);
  computer_1.name = "Shelfie";
  const user_1 = new User(deps);

  return { computer_1, user_1 };
};
