import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

interface ChatMessage {
  time: Date;
  message: string;
}
@customElement("bookshelf-adventure")
export class Adventure extends LitElement {
  @property()
  computerChats: ChatMessage[] = [];
  userChats?: ChatMessage[] = [];

  public addComputerChat(message: string) {
    const chat: ChatMessage = { time: new Date(), message };
    this.computerChats.push(chat);
  }

  public addUserChat(message: string) {
    const chat: ChatMessage = { time: new Date(), message };
    this.userChats?.push(chat);
  }

  chatsTemplate() {
    return this.computerChats.map(() => "");
  }
  outputsTemplate() {
    return (
      html`<header>Bookshelf Adventures</header>
        <section>${this.chatsTemplate()}</section>`
    );
  }

  controlsTemplate() {
    return html`<article>
      <input type="text" id="userControl" />
    </article>`;
  }

  render() {
    return html` ${this.outputsTemplate()} ${this.controlsTemplate()} `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "bookshelf-adventure": Adventure;
  }
}
