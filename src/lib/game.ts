import * as Rx from "rxjs";
import { filter, skip, take, tap } from "rxjs/operators";
import { User } from "./user";
import { Canvas } from "./canvas";

interface GameDeps {
  user: User;
  canvas: Canvas;
}

type WriteOutputFn = (output: string) => void;

enum LogLevel {
  DEBUG = "0",
  INFO = "1",
  WARN = "2",
  ERROR = "3",
}

type LogFn = (level: LogLevel, message: string | Error) => void;
const LOG_DEBUG = LogLevel.DEBUG;

export class Game {
  private log: LogFn = (_level, message) => {
    console.log(`[Game] ${message}`);
  };

  constructor(
    private input$: Rx.Observable<string>,
    private writeOutput: WriteOutputFn,
    private deps: GameDeps
  ) {
  }

  public setup() {
    // DOMContentLoaded
    this.log(LOG_DEBUG, "in setup");
    const canvas = document.getElementById('canvas') as HTMLDivElement | null;
    if (!canvas) {
      throw new Error('game setup error!')
    }
    this.deps.canvas.setup(canvas);
    this.log(LOG_DEBUG, "setup complete");
  }

  public start() {
    // document loaded
    this.log(LOG_DEBUG, "in start");
    this.deps.canvas.start();

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

    this.input$.pipe(skip(1)).subscribe((inputStr) => {
      // handle general input
      this.log(LOG_DEBUG, `> [${inputStr}]`);
    });

    this.log(LOG_DEBUG, "start complete");
  }

  public greet() {
    return `Hello ${this.deps.user.name}`;
  }
}
