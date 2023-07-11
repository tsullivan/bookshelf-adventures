import { createApp } from "vue";
import App from "../App.vue";

export class Canvas {
  private el: HTMLDivElement | null = null;

  public setup(el: HTMLDivElement) {
    this.el = el;
  }

  public start() {
    if (!this.el) {
      throw new Error(`canvas startup error!`);
    }
    // replace loading message
    this.el.replaceChildren();
    document.title = 'Bookshelf Adventures'

    createApp(App).mount("#canvas");
  }
}
