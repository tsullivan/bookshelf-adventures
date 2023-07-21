import * as Rx from "rxjs";
import { delay, map, skip, switchMap, take } from "rxjs/operators";
import { Responder } from "./responder";
import { User } from "./user";

const PROTAGONIST = "Shelfie";

export interface GameDeps {
  user: User;
  synth: { speak: SpeechSynthesis["speak"] };
  responder:  Responder;
}

enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
}
const LOG_DEBUG = LogLevel.DEBUG;
// const LOG_INFO = LogLevel.INFO;
type LogFn = (level: LogLevel, message: string | Error) => void;

export class Game {
  constructor(
    private input$: Rx.Observable<string>,
    onMessage: (message: string) => void,
    private deps: GameDeps
  ) {
    this.output$.subscribe(onMessage);
    this.deps.responder = new Responder(); // FIXME: instantiate from caller
  }

  private log: LogFn = (level, message) => {
    console.log(`[Game/${level}] ${message}`);
  };

  private output$ = new Rx.ReplaySubject<string>();

  private writeOutput = (nextOutput: string) => {
    this.output$.next(nextOutput);
  };

  private speak = (message: string) => {
    const utterance = new SpeechSynthesisUtterance(message);
    this.deps.synth.speak(utterance);
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
        const response$ = this.deps.responder.getResponse$(inputValue);
        // TODO use a service to get an observable to use here
        return response$;
      })
    );

    Rx.merge(takeName$, takeChats$)
      .pipe(delay(1000))
      .subscribe((outputStr) => {
        this.speak(outputStr);
        this.writeOutput(outputStr);
      });

    this.log(LOG_DEBUG, "start complete");
  }

  public greet() {
    return `Hello ${this.deps.user.name}`;
  }
}
