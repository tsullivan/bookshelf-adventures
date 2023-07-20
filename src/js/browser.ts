import * as Rx from 'rxjs';
import { Game, GameDeps } from "./lib/game";
import { User } from "./lib/user";
import "./components";

function browser() {
  const user = new User();
  // Create UI component
  const gameUi = document.createElement("bookshelf-adventure");
  gameUi.user = user;

  // Create responder module
  const input$ = gameUi.getInput$();
  const gameDeps: GameDeps = {
    user,
    synth: window.speechSynthesis,
  };
  const onMessage = (message: string) => {
    gameUi.addChat({
      source: "computer",
      time: new Date(), // unused
      message,
    });
  };
  const game = new Game(input$, onMessage, gameDeps);

  return { game, gameUi };
}

const { game, gameUi } = browser();

// Begin
document.addEventListener("DOMContentLoaded", () => {
  game.setup();
});

window.onload = () => {
  const canvasEl = document.getElementById("canvas") as HTMLDivElement;
  if (!canvasEl) throw new Error(`Start error: invalid HTML`);
  canvasEl.replaceChildren(gameUi);
  game.start();
  document.title = "Bookshelf Adventures";
};
