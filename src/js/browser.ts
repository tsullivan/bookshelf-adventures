import { Game } from "./lib/game";
import { User } from "./lib/user";
import "./components";

function browser() {
  // UI component
  const gameUi = document.createElement("bookshelf-adventure");

  // Logic
  const gameDeps = { user: new User() };
  const game = new Game(gameUi.getInput$(), gameDeps);

  // Attach
  game.getOutput$().subscribe((message) => {
    gameUi.addChat({
      source: "computer",
      time: new Date(), // unused
      message,
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    game.setup();
  });

  window.onload = () => {
    const canvasEl = document.getElementById("canvas") as HTMLDivElement;
    if (!canvasEl) throw new Error(`Start error: invalid HTML`);
    canvasEl.replaceChildren(gameUi);
    game.start();
  };
}
browser();
