import * as Rx from "rxjs";
import { filter, skip, switchMap, take, tap } from "rxjs/operators";
import { User } from "./user";

interface GameDeps {
  user: User;
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

  constructor(private input$: Rx.Observable<string>, private deps: GameDeps) {}

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

    this.input$
      .pipe(
        filter(() => true),
        take(1),
        tap((name) => {
          // handle username provided
          this.deps.user.name = name;
          this.writeOutput(`Hello, ${name}!`);
        })
      )
      .subscribe();

    this.input$
      .pipe(
        skip(1),
        switchMap((inputValue) => {
          // TODO return an observable provided from an input analyzer
          if (inputValue === "help") {
            return Rx.of(
              `You can type "whoami" and I will tell you your name.`
            );
          }
          if (inputValue === "whoami") {
            return Rx.of(`You are ${this.deps.user.name}`);
          }
          return Rx.of(`You  wrote: ${inputValue}`);
        })
      )
      .subscribe((outputStr) => {
        this.writeOutput(outputStr);
      });

    this.log(LOG_DEBUG, "start complete");
  }

  public getOutput$() {
    return this.output$.asObservable();
  }

  public greet() {
    return `Hello ${this.deps.user.name}`;
  }
}
