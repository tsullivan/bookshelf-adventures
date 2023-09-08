import { GameDeps } from "./services";

export interface VoiceServices {
  getAllVoices: () => SpeechSynthesisVoice[];
  getComputerVoice: () => SpeechSynthesisVoice;
  getUserVoice: () => SpeechSynthesisVoice;
  storeComputerVoice: (voice: SpeechSynthesisVoice) => void;
  storeUserVoice: (voice: SpeechSynthesisVoice) => void;
}

const [COMPUTER_VOICE, USER_VOICE] = ["computer_voice", "user_voice"] as const;

const parseVoiceObject = (
  storedVal: string | null
): SpeechSynthesisVoice | null => {
  try {
    if (storedVal == null) {
      throw new Error(`stored voice object is null!`);
    }
    const parsed: SpeechSynthesisVoice = JSON.parse(storedVal);
    if (!parsed.name) {
      throw new Error(`object lacks name!`);
    }
    if (!parsed.lang) {
      throw new Error(`object lacks lang!`);
    }
    if (!parsed.voiceURI) {
      throw new Error(`object lacks voiceURI!`);
    }
    if (!parsed.localService) {
      throw new Error(`object lacks localService!`);
    }
    return parsed;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const serializeVoiceObject = (voice: SpeechSynthesisVoice): string => {
  const newObject: Partial<
    Record<keyof SpeechSynthesisVoice, string | boolean>
  > = {};

  newObject.name = voice.name;
  newObject.lang = voice.lang;
  newObject.localService = voice.localService;
  newObject.voiceURI = voice.voiceURI;

  return JSON.stringify(newObject);
};

export class Voices implements VoiceServices {
  private voices: SpeechSynthesisVoice[] | null = null;

  constructor(private synth: GameDeps["synth"]) {}

  getAllVoices() {
    // initialize the voices array
    const voices = this.voices;
    if (voices == null || voices.length === 0) {
      console.log("collecting voices...");
      this.voices = this.synth.getVoices();
    }
    return this.voices ?? [];
  }

  getComputerVoice(): SpeechSynthesisVoice {
    const stored = parseVoiceObject(localStorage.getItem(COMPUTER_VOICE));
    if (stored == null) {
      localStorage.removeItem(COMPUTER_VOICE);
    } else {
      // return stored;
    }

    const voice = this.getAllVoices().find((voice) => voice.default);
    if (voice) {
      localStorage.setItem(COMPUTER_VOICE, serializeVoiceObject(voice));
      return voice;
    }
    throw new Error(`Unable to fetch a computer voice!`);
  }

  getUserVoice(): SpeechSynthesisVoice {
    const stored = parseVoiceObject(localStorage.getItem(USER_VOICE));
    if (stored == null) {
      localStorage.removeItem(USER_VOICE);
    } else {
      // return stored;
    }

    const voices = this.getAllVoices();
    const voiceIndex = voices.findIndex((voice) => voice.default);
    const voice = voices[voiceIndex + 1];
    if (voice) {
      localStorage.setItem(USER_VOICE, serializeVoiceObject(voice));
      return voice;
    }
    throw new Error(`Unable to fetch a user voice!`);
  }

  storeComputerVoice(voice: SpeechSynthesisVoice) {
    // FIXME not working
    // localStorage.setItem(COMPUTER_VOICE, serializeVoiceObject(voice));
    voice;
  }

  storeUserVoice(voice: SpeechSynthesisVoice) {
    // FIXME not working
    // localStorage.setItem(USER_VOICE, serializeVoiceObject(voice));
    voice;
  }
}

export const createVoiceServices = (synth: GameDeps["synth"]) => {
  return new Voices(synth);
};
