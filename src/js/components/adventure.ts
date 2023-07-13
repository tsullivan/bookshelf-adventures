import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

interface ChatMessage {
  source: "computer" | "user";
  time: Date;
  message: string;
}
@customElement("bookshelf-adventure")
export class Adventure extends LitElement {
  @property()
  private chats: ChatMessage[] = [];

  addChat(chat: ChatMessage) {
    this.chats = this.chats.concat(chat);
  }

  chatsTemplate() {
    return this.chats.map(({ time, source, message }) => {
      return html`
        ${time.toISOString()}<br />
         [${source}] ${message}<br /><br />
      `;
    });
  }

  render() {
    return html`
      <section>${this.chatsTemplate()}</section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "bookshelf-adventure": Adventure;
  }
}
