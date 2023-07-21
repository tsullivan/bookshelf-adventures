import * as Rx from "rxjs";
import { Game } from "./game";
import { User } from "./user";

let game: Game;

beforeAll(() => {
  const input$ = new Rx.BehaviorSubject<string>(`Hello`);
  const onMessage = jest.fn();

  const user = new User();
  user.name = "Foo";
  const synth = { speak: jest.fn() };
  game = new Game(input$, onMessage, { user, synth });
});

test("greeting", () => {
  expect(game.greet()).toBe("Hello Foo");
});
