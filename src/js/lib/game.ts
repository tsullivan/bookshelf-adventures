import * as Rx from "rxjs";
import { delay, map, skip, take } from "rxjs/operators";
import { User } from "./user";

const PROTAGONIST = "Shelfie";

export interface GameDeps {
  user: User;
  synth: { speak: SpeechSynthesis["speak"] };
}

enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
}
const LOG_DEBUG = LogLevel.DEBUG;
// const LOG_INFO = LogLevel.INFO;
type LogFn = (level: LogLevel, message: string | Error) => void;

export class Game {
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

  constructor(
    private input$: Rx.Observable<string>,
    onMessage: (message: string) => void,
    private deps: GameDeps
  ) {
    this.output$.subscribe(onMessage);
  }

  public setup() {
    // DOMContentLoaded
    this.log(LOG_DEBUG, "in setup");
    this.log(LOG_DEBUG, "setup complete");
  }

  public start() {
    // document loaded
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
      map((inputValue) => {
        // TODO use a service to get an observable to use here
        return `${this.deps.user.name} wrote: ${inputValue}`;
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
