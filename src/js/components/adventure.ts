import * as Rx from "rxjs";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { css } from "lit-element/lit-element.js";

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
    const chatList = [];
    for (let i = this.chats.length - 1; i >= 0; i--) {
      const { source, message } = this.chats[i];
      chatList.push(html` <p>[${source}] ${message}</p> `);
    }
    return chatList;
  }

  private handleInputTextKeyUp(event: KeyboardEvent) {
    const { code } = event;
    const target = event.target as HTMLInputElement;

    if (code === "Enter" && target.value !== "") {
      const input = target.value;
      this.addChat({
        source: "user",
        time: new Date(),
        message: input,
      });
      this.input$.next(input);
      target.value = ""; // clear the text input
    }
  }
  private inputTemplate() {
    return html`<input
      type="text"
      @keyup=${this.handleInputTextKeyUp}
      autofocus
    />`;
  }

  protected render() {
    return html`
      <div id="inputs" style="margin-bottom: 10px">${this.inputTemplate()}</div>
      <div id="chats" aria-live="assertive">${this.chatsTemplate()}</div>
    `;
  }

  static styles = css`
    :host {
      height: 100%;
      padding: 10px;
    }
    #chats {
      height: calc(100% - 120px);
      overflow-y: auto;
    }
    input {
      font-size: 1rem;
      font-family: monospace;
      width: 500px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "bookshelf-adventure": Adventure;
  }
}
