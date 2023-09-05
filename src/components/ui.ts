import { LitElement, html } from "lit";
import { css } from "lit-element/lit-element.js";
import { customElement, property } from "lit/decorators.js";
import * as Rx from "rxjs";
import { User } from "../lib/user";

interface ChatMessage {
  source: "computer" | "user";
  time: Date;
  message: string;
}

@customElement("bookshelf-adventure")
export class Ui extends LitElement {
  public user?: User;

  @property({ attribute: false })
  private chats: ChatMessage[] = [];

  private input$ = new Rx.ReplaySubject<string>();

  public addComputerChat({ message, time }: { time: Date; message: string }) {
    const newChat: ChatMessage = { message, time, source: "computer" };
    this.chats = [newChat].concat(this.chats);
  }

  public addUserChat({ message, time }: { message: string; time: Date }) {
    const newChat: ChatMessage = { message, time, source: "user" };
    this.chats = [newChat].concat(this.chats);
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
    if (code !== "Enter" || target.value === "") {
      return;
    }

    this.chats.length = 0;
    const input = target.value;
    target.value = ""; // clear the text input
    this.input$.next(input);
    this.addUserChat({
      time: new Date(),
      message: input,
    });
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
      <div id="chats" aria-live="assertive">${this.chatsTemplate()}</div>
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
    "bookshelf-adventure": Ui;
  }
}
