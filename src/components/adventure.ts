import * as Rx from "rxjs";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { css } from "lit-element/lit-element.js";
import { User } from "../lib/user";

interface ChatMessage {
  source: "computer" | "user";
  time: Date;
  message: string;
}

@customElement("bookshelf-adventure")
export class Adventure extends LitElement {
  public user?: User;

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
      return html`<p>
        [${source === "user" ? this.user?.name : source}] ${message}
      </p>`;
    });
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
      <div id="chats" aria-live="assertive" style="margin-bottom: 10px">
        ${this.chatsTemplate()}
      </div>
      <div id="inputs">${this.inputTemplate()}</div>
    `;
  }

  static styles = css`
    :host {
      height: 100%;
    }
    #chats {
      height: calc(100% - 50px);
      overflow-y: auto;
    }
    input {
      font-size: 1.2rem;
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
