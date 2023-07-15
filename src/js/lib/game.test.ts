import * as Rx from "rxjs";
import { Game } from "./game";
import { User } from "./user";

let game: Game;

beforeAll(() => {
  const input$ = new Rx.BehaviorSubject<string>(`Hello`);

  const user = new User();
  user.name = "Foo";
  game = new Game(input$, { user });
});

test("greeting", () => {
  expect(game.greet()).toBe("Hello Foo");
});

// TODO use getOutput$
