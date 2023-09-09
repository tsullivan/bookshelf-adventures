import "./components";
import type { GameDeps, GraphicsGame } from "./lib";
import { Services } from "./lib/services";
import { createUsers } from "./lib/user";
import { createVoiceServices } from "./lib/voices";

function browser() {
  const synth = window.speechSynthesis;
  const voices = createVoiceServices(synth);
  const users = createUsers({ synth, voices });
  // Create UI component
  const gameUi = document.createElement("bookshelf-adventure");
  gameUi.user = users.user_1;

  // Create responder module
  const input$ = gameUi.getInput$();
  const onMessage = (message: string) => {
    gameUi.addComputerChat({
      time: new Date(), // unused
      message,
    });
  };
  const gameDeps: GameDeps = { voices, users, synth };
  const gameServices = new Services(input$, gameDeps, onMessage);
  return { services: gameServices, gameUi };
}

const { services, gameUi } = browser();

// Begin
document.addEventListener("DOMContentLoaded", () => {
  services.setup();
});

window.onload = () => {
  const mountElement = document.getElementById("mount") as HTMLDivElement;
  if (!mountElement) throw new Error(`Start error: invalid HTML`);
  mountElement.replaceChildren(gameUi);
  const { gameExit$, gameLaunch$ } = services.start();
  document.title = "Bookshelf Adventures";

  const gameHandles: GraphicsGame[] = [];

  // tests
  gameLaunch$.subscribe(function (game) {
    window.alert(JSON.stringify({ launch: game }));

    gameHandles.push(game);
    game.start();
  });
  gameExit$.subscribe(function (event) {
    window.alert(JSON.stringify({ exit: event }));

    gameHandles.forEach((game) => {
      game.stop();
    });
    gameHandles.length = 0;
  });
};
