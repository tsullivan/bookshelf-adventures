import "./components";
import { Services, GameDeps } from "./lib/services";
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
  const gameServices = new Services(input$, gameDeps, onMessage);

  return { services: gameServices, gameUi };
}

const { services, gameUi } = browser();

// Begin
document.addEventListener("DOMContentLoaded", () => {
  services.setup();
});

window.onload = () => {
  const canvasEl = document.getElementById("canvas") as HTMLDivElement;
  if (!canvasEl) throw new Error(`Start error: invalid HTML`);
  canvasEl.replaceChildren(gameUi);
  services.start();
  document.title = "Bookshelf Adventures";
};
