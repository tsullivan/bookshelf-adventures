import * as Rx from "rxjs";
import { Game } from "./game";

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

const user = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setName: (_name: string) => {
    return;
  },
};
const gameDeps = { user };

const game = new Game(input$, writeOutput, gameDeps);
game.start();
