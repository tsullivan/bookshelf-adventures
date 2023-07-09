import * as Rx from "rxjs";
import { Game } from "./lib/game";
import { User } from "./lib/user";
import { Canvas } from "./lib/canvas";

const input$ = new Rx.ReplaySubject<string>();
const output$ = new Rx.ReplaySubject<string>();
const game = new Game(
  input$,
  (output: string) => {
    output$.next(output);
  },
  { canvas: new Canvas(), user: new User() }
);

document.addEventListener("DOMContentLoaded", () => {
  game.setup();
});
window.onload = () => {
  game.start();
};

// testing
output$.subscribe((output) => {
  if (output) {
    console.log(`> ${output}`);
  }
});
input$.subscribe((input) => {
  console.log(`< ${input}`);
});
setTimeout(() => {
  input$.next("Test User");
}, 800);
