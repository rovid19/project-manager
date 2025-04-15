import { closeModalBtn } from "../Assets/Icons";
import { createElement } from "../Utils/Helpers";

export function createPopupModal(onClickCallback: () => void) {
  const popup = createElement({
    tag: "div",
    className: "popup-overlay",
    children: [
      createElement({
        tag: "div",
        className: "project-popup",
        children: [
          createElement({
            tag: "div",
            className: "popup-close-div",
            innerHTML: closeModalBtn,
            onClick: () => {
              onClickCallback();
            },
          }),
          createElement({ tag: "div", className: "popup-main-div" }),
        ],
      }),
    ],
  });

  return popup;
}
