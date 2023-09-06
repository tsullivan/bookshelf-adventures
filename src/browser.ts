import "./components";
import { Game, GameDeps } from "./lib/game";
import { createUsers } from "./lib/user";

function browser() {
  const synth = window.speechSynthesis;
  const users = createUsers({ synth });
  // Create UI component
  const gameUi = document.createElement("bookshelf-adventure");
  gameUi.user = users.user_1;

  // Create responder module
  const input$ = gameUi.getInput$();
  const gameDeps: GameDeps = { users, synth };
  const onMessage = (message: string) => {
    gameUi.addComputerChat({
      time: new Date(), // unused
      message,
    });
  };
  const game = new Game(input$, gameDeps, onMessage);

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
