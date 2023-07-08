import * as Rx from 'rxjs';
import { Game } from './main'

const output$ = new Rx.BehaviorSubject<string | undefined>(undefined);
function writeOutput(output: string) {
    output$.next(output);
}

output$.subscribe((output) => console.log(output));

// testing
const input$ = new Rx.BehaviorSubject<string>('Hello!');
setInterval(() => {
    input$.next('Hello again!');
}, 500)

const game = new Game(input$, writeOutput);
game.start();
