import * as Rx from 'rxjs';

type WriteOutputFn = (output: string) => void;

export class Game {
  constructor(private input$: Rx.Observable<string>, private writeOutput: WriteOutputFn) {
    //
  }

  public start() {
    this.input$.subscribe((inputStr) => {
      this.writeOutput(`you wrote: ${inputStr}`);
    })
  }
}