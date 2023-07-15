import * as Rx from "rxjs";
import { delay, map, skip, take } from "rxjs/operators";
import { User } from "./user";

const PROTAGONIST = "Shelfy";

export interface GameDeps {
  user: User;
  synth: { speak: SpeechSynthesis["speak"] };
}

enum LogLevel {
  DEBUG = "0",
  INFO = "1",
  WARN = "2",
  ERROR = "3",
}

type LogFn = (level: LogLevel, message: string | Error) => void;
const LOG_DEBUG = LogLevel.DEBUG;
// const LOG_INFO = LogLevel.INFO;

export class Game {
  private log: LogFn = (_level, message) => {
    console.log(`[Game] ${message}`);
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

    const askName$ = this.input$.pipe(
      take(1),
      map((name) => {
        // handle username provided
        this.deps.user.name = name;
        return `Hello, ${name}! My name is ${PROTAGONIST}.`;
      })
    );
    const chat$ = this.input$.pipe(
      skip(1),
      map((inputValue) => {
        // TODO use a service to get an observable to use here
        return `${this.deps.user.name} wrote: ${inputValue}`;
      })
    );

    Rx.merge(askName$, chat$)
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
