import * as Rx from "rxjs";
import { filter, map, skip, switchMap, take, tap } from "rxjs/operators";
import { GameServices, Responder } from "./responder";
import { User } from "./user";

const PROTAGONIST = "Shelfie";

export interface GameDeps {
  synth: {
    speak: SpeechSynthesis["speak"];
    cancel: SpeechSynthesis["cancel"];
    getVoices: SpeechSynthesis["getVoices"];
  };
  user: User;
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
  private _services: GameServices = {
    setIsMuted: (value: boolean) => {
      this._isMuted = value;
    },
    getCommands: () => {
      return this.responder.getCommands();
    },
  };

  constructor(
    private input$: Rx.Observable<string>,
    onMessage: (message: string) => void,
    private deps: GameDeps
  ) {
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
          const utterance = new SpeechSynthesisUtterance(input);
          this.deps.synth.cancel();
          this.deps.synth.speak(utterance);
        })
      )
      .subscribe();

    const takeName$ = this.input$.pipe(
      take(1),
      map((name) => {
        // handle username provided
        this.deps.user.name = name;
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
          // FIXME: auto cancellation if the user starts typing again
          const utterance = new SpeechSynthesisUtterance(outputStr);
          this.deps.synth.speak(utterance);
        }
        this.writeOutput(outputStr);
      });

    this.log(LOG_DEBUG, "start complete");
  }

  public greet() {
    return `Hello ${this.deps.user.name}`;
  }
}
