import * as Rx from "rxjs";
import { Game } from "./lib/game";
import { User } from "./lib/user";
import "./components";

function browser() {
  const output$ = new Rx.ReplaySubject<string>();
  const writeOutput = (nextOutput: string) => {
    output$.next(nextOutput);
  }
  const adventure = document.createElement("bookshelf-adventure");
  const gameDeps = { user: new User() };
  const game = new Game(writeOutput, adventure.getInput$(), gameDeps);

  output$.subscribe((output) => {
    adventure.addChat({
      source: "computer",
      time: new Date(),
      message: output,
    });
  });

  return { game, adventure };
}
const { game, adventure } = browser();

document.addEventListener("DOMContentLoaded", () => {
  game.setup();
});
window.onload = () => {
  const canvasEl = document.getElementById("canvas") as HTMLDivElement;
  if (!canvasEl) throw new Error(`Start error: invalid HTML`);
  canvasEl.replaceChildren(adventure);
  game.start();
};
