import * as Rx from "rxjs";
import { Game } from "./lib/game";
import { User } from "./lib/user";

const input$ = new Rx.ReplaySubject<string>();
const output$ = new Rx.ReplaySubject<string>();
function writeOutput(output: string) {
  output$.next(output);
}

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

const user = new User();
const deps = { user };
const game = new Game(input$, writeOutput, deps);

document.addEventListener('DOMContentLoaded', () => {
  game.setup();
})
window.onload = () => {
  game.start();
};