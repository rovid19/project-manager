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

/*  const teamPage = createElement({
      tag: "div",
      className: "upper-section",
      children: [
        createElement({
          tag: "section",
          className: "inner-section",
          children: [
            createElement({
              tag: "div",
              className: "section-header",
              children: [
                createElement({
                  tag: "h3",
                  className: "section-title",
                  text: "Teams",
                }),
                createElement({
                  tag: "button",
                  className: "create-team-btn",
                  text: "Create New Team",
                  // onClick: () => this.handleCreateTeamPopup(),
                }),
              ],
            }),
          ],
        }),
      ],
    });
    */
