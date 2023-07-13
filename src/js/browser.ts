import * as Rx from "rxjs";
import { Game } from "./lib/game";
import { User } from "./lib/user";
import "./components";

function browser() {
  const input$ = new Rx.ReplaySubject<string>();
  const output$ = new Rx.ReplaySubject<string>();
  const game = new Game(
    input$,
    (output: string) => {
      output$.next(output);
    },
    { user: new User() }
  );

  const adventure = document.createElement("bookshelf-adventure");

  document.addEventListener("DOMContentLoaded", () => {
    game.setup();
  });

  window.onload = () => {
    game.start();
    const canvasEl = document.getElementById("canvas") as HTMLDivElement;
    if (!canvasEl) {
      throw new Error(`Start error: invalid HTML`);
    }
    canvasEl.replaceChildren(adventure);
  };

  output$.subscribe((output) => {
    adventure.addChat({
      source: "computer",
      time: new Date(),
      message: output,
    });
  });
  input$.subscribe((input) => {
    adventure.addChat({
      source: "user",
      time: new Date(),
      message: input,
    });
  });

  // testing
  setTimeout(() => {
    input$.next("Test User");
  }, 1100);
}

browser();
