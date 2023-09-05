interface UserDeps {
  synth: {
    getVoices: SpeechSynthesis["getVoices"];
  };
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

  get voice(): SpeechSynthesisVoice {
    if (this._voice) {
      return this._voice;
    }

    const voices = this.deps.synth.getVoices();
    this._voice = voices[2];
    return this._voice;
  }

  set voice(voice: SpeechSynthesisVoice) {
    this._voice = voice;
  }
}
