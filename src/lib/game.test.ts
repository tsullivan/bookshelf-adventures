import * as Rx from "rxjs";
import { Game } from "./game";
import { User } from "./user";
import { Canvas } from "./canvas";

let game: Game;

beforeAll(() => {
  const input$ = new Rx.BehaviorSubject<string>(`Hello`);
  const writeOutput = jest.fn();

  const canvas = new Canvas();
  const user = new User();
  user.name = "Foo";
  const deps = { canvas, user };
  game = new Game(input$, writeOutput, deps);
});

test("greeting", () => {
  expect(game.greet()).toBe("Hello Foo");
});
