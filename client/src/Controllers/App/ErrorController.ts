import { store } from "../../Store/Store";
import { createElement } from "../../Utils/Helpers";
import "../../Styles/Error.css";
import { error } from "../../Assets/Icons";

export class ErrorController {
  errorContainer: HTMLElement | null = null;
  constructor() {}

  createError() {
    const currentState = store.getState();
    const mainDiv = document.querySelector("#app");
    const errorElement = createElement({
      tag: "div",
      className: "error-div",
      children: [
        createElement({
          tag: "div",
          innerHTML: error,
        }),
        createElement({
          tag: "h1",
          className: "error-heading",
          innerText: "404",
        }),
        createElement({
          tag: "p",
          className: "error-subheading",
          innerText: "Page has not been found",
        }),
      ],
    });

    this.errorContainer = errorElement;

    if (!currentState.mainSection) {
      mainDiv?.appendChild(errorElement);
    } else {
      currentState.mainSection.appendChild(errorElement);
    }
  }

  delete() {
    this.errorContainer?.remove();
  }
}
