import { ResponderModule } from ".";
import { ofStatic } from "./utils";

export class BatcaveResponder extends ResponderModule {
  name = "batcave";
  description = "Store your important items in the Batcave.";

  private _items: string[] = [];

  public getResponse$(input: string) {
    this._isActive = true;

    if (["kl", "77"].includes(input)) {
      this.isActive = false;
      if (input === 'kl') {
        this._items.length = 0;
        return ofStatic("You're leaving the Batcave! You have lost your stuff.");
      } else {
        return ofStatic("You're leaving the Batcave! You have kept all your stuff.");
      }
    }

    let response = "";
    if (input && input.toLowerCase() !== "batcave") {
      this._items.push(input);
      response += `Added ${input}.\n\n`;
    }

    if (this._items.length !== 0) {
      response += `Items:`;
      this._items.forEach((item, index) => {
        response += `\n${index + 1}. ${item}`;
      });
    }

    return ofStatic(
      [
        response,
        "You're in the Batcave! Type items to store. Type 'kl' to leave or 77 to keep your stuff.",
      ].join("\n\n")
    );
  }
  public keywordCheck(input: string): boolean {
    return input.toLowerCase().match(/^batcave$/) !== null;
  }
}
