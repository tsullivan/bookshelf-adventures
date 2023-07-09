import * as Rx from "rxjs";
import { Game } from "./game";
import { User } from "./user";

let game: Game;

beforeAll(() => {
  const input$ = new Rx.BehaviorSubject<string>(`Hello`);
  const writeOutput = jest.fn();

  const user = new User();
  user.name = "Foo";
  const deps = { user };
  game = new Game(input$, writeOutput, deps);
});

test("greeting", () => {
  expect(game.greet()).toBe("Hello Foo");
});
