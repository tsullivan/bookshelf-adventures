import * as Rx from "rxjs";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

interface ChatMessage {
  source: "computer" | "user";
  time: Date;
  message: string;
}

@customElement("bookshelf-adventure")
export class Adventure extends LitElement {
  @property({ attribute: false })
  private chats: ChatMessage[] = [];

  private input$ = new Rx.ReplaySubject<string>();

  public addChat(chat: ChatMessage) {
    this.chats = this.chats.concat(chat);
  }

  public getInput$() {
    return this.input$.asObservable();
  }

  private chatsTemplate() {
    return this.chats.map(({ source, message }) => {
      return html` <p>[${source}] ${message}</p> `;
    });
  }

  private handleInputTextKeyUp(event: KeyboardEvent) {
    const { code } = event;
    const target = event.target as HTMLInputElement;

    if (code === "Enter") {
      const input = target.value;
      this.addChat({
        source: "user",
        time: new Date(),
        message: input,
      });
      this.input$.next(input);
      target.value = "";
    }
  }
  private inputTemplate() {
    return html`<input
      type="text"
      @keyup=${this.handleInputTextKeyUp}
      autofocus
    />`;
  }

  render() {
    return html`
      <section>${this.chatsTemplate()}</section>
      <section>${this.inputTemplate()}</section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "bookshelf-adventure": Adventure;
  }
}
