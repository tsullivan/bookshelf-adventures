import * as Rx from "rxjs";
import { filter, map, skip, switchMap, take, tap } from "rxjs/operators";
import { Responder } from "./responder";
import type { createUsers } from "./user";
import { VoiceServices } from "./voices";

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

enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
}
const LOG_DEBUG = LogLevel.DEBUG;
// const LOG_INFO = LogLevel.INFO;
type LogFn = (level: LogLevel, message: string | Error) => void;

export class Services {
  private readonly output$ = new Rx.ReplaySubject<string>();
  private readonly responder: Responder;
  private readonly services: GameServices;
  private isMuted = false;
  constructor(
    private input$: Rx.Observable<string>,
    private deps: GameDeps,
    onMessage: (message: string) => void
  ) {
    const services: GameServices = {
      getCommands: () => {
        return this.responder.getCommands();
      },
      setIsMuted: (value: boolean) => {
        this.isMuted = value;
      },
      voices: this.deps.voices,
      setComputerVoice: (voice: SpeechSynthesisVoice) => {
        this.deps.users.computer_1.setVoice(voice);
        this.deps.voices.storeComputerVoice(voice);
      },
      setUserVoice: (voice: SpeechSynthesisVoice) => {
        this.deps.users.user_1.setVoice(voice);
        this.deps.voices.storeUserVoice(voice);
      },
    };
    this.services = services;
    this.responder = new Responder(this.services);
    this.output$.subscribe(onMessage);
  }

  private log: LogFn = (level, message) => {
    console.log(`[Game/${level}] ${message}`);
  };

  private writeOutput = (nextOutput: string) => {
    this.output$.next(nextOutput);
  };

  /* DOMContentLoaded */
  public setup() {
    this.log(LOG_DEBUG, "in setup");
    this.log(LOG_DEBUG, "setup complete");
  }

  /* window loaded */
  public start() {
    this.log(LOG_DEBUG, "in start");

    // assign initial voices
    // voices are only available after 1st user interaction
    this.input$.pipe(take(1)).subscribe(() => {
      this.deps.users.user_1.setVoice(this.deps.voices.getUserVoice());
      this.deps.users.computer_1.setVoice(this.deps.voices.getComputerVoice());
    });

    // begin chats
    this.writeOutput("Hello! What is your name?");

    const takeName$ = this.input$.pipe(
      take(1),
      map((name) => {
        // handle username provided
        this.deps.users.user_1.name = name;
        return `Hello, ${name}!.`;
      })
    );

    this.input$
      .pipe(
        tap((input) => {
          this.deps.synth.cancel(); // cancel computer's speech, if active
          this.deps.users.user_1.speak(input); // NOTE muted is ignored
        })
      )
      .subscribe();

    const applyResponse$ = this.input$.pipe(
      skip(1),
      switchMap((inputValue) => {
        const [responderModule] = this.responder.getResponders(inputValue);
        const response$ = responderModule.getResponse$(inputValue);
        return response$;
      })
    );

    Rx.merge(takeName$, applyResponse$)
      .pipe(filter(Boolean))
      .subscribe((outputStr) => {
        if (!this.isMuted) {
          this.deps.users.computer_1.speak(outputStr);
        }
        this.writeOutput(outputStr);
      });


    this.log(LOG_DEBUG, "start complete");
  }
}
