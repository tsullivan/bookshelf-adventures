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
  }
}
