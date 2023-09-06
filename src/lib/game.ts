import * as Rx from "rxjs";
import { filter, map, skip, switchMap, take, tap } from "rxjs/operators";
import { Responder } from "./responder";
import type { createUsers } from "./user";

const PROTAGONIST = "Shelfie";

export interface CommandInfo {
  command: string;
  description: string;
}

export interface GameServices {
  getCommands: () => CommandInfo[];
  getVoices: SpeechSynthesis["getVoices"];
  setUserVoice: (voice: SpeechSynthesisVoice) => void;
  setIsMuted: (value: boolean) => void;
}

export interface GameDeps {
  synth: {
    cancel: SpeechSynthesis["cancel"];
    speak: SpeechSynthesis["speak"];
    getVoices: SpeechSynthesis["getVoices"];
  };
  users: ReturnType<typeof createUsers>;
}

enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
}
const LOG_DEBUG = LogLevel.DEBUG;
// const LOG_INFO = LogLevel.INFO;
type LogFn = (level: LogLevel, message: string | Error) => void;

export class Game {
  private output$ = new Rx.ReplaySubject<string>();
  private responder: Responder;
  private _isMuted = false;

  private readonly _services: GameServices;

  constructor(
    private input$: Rx.Observable<string>,
    private deps: GameDeps,
    onMessage: (message: string) => void
  ) {
    this._services = {
      getCommands: () => {
        return this.responder.getCommands();
      },
      getVoices: () => {
        return this.deps.synth.getVoices();
      },
      setUserVoice: (voice: SpeechSynthesisVoice) => {
        this.deps.users.user_1.voice = voice;
      },
      setIsMuted: (value: boolean) => {
        this._isMuted = value;
      },
    };
    this.responder = new Responder(this._services);
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

    // begin chats
    this.writeOutput("Hello! What is your name?");

    this.input$
      .pipe(
        tap((input) => {
          if (!this._isMuted) {
            this.deps.synth.cancel() // allow user to cancel computer's speech
            this.deps.users.user_1.speak(input);
          }
        })
      )
      .subscribe();

    const takeName$ = this.input$.pipe(
      take(1),
      map((name) => {
        // handle username provided
        this.deps.users.user_1.name = name;
        return `Hello, ${name}! My name is ${PROTAGONIST}.`;
      })
    );
    const takeChats$ = this.input$.pipe(
      skip(1),
      switchMap((inputValue) => {
        // FIXME: combine all matched
        const [responderModule] = this.responder.getResponders(inputValue);
        const response$ = responderModule.getResponse$(inputValue);
        return response$;
      })
    );

    Rx.merge(takeName$, takeChats$)
      .pipe(filter(Boolean))
      .subscribe((outputStr) => {
        if (!this._isMuted) {
          this.deps.users.computer_1.speak(outputStr);
        }
        this.writeOutput(outputStr);
      });

    this.log(LOG_DEBUG, "start complete");
  }
}
