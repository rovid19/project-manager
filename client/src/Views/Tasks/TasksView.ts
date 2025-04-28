import { createElement } from "../../Utils/Helpers";
import "../../Styles/Views/Tasks/Tasks.css";
import "../../Styles/SharedStylings/SectionHeader.css";
import "../../Styles/SharedStylings/UpperInnerSection.css";

import { store } from "../../Store/Store";

export class TasksView {
  constructor() {}
  delete() {
    document.querySelector(".upper-section")?.remove();
  }
  createTasks() {
    const tasksContainer = createElement({
      tag: "div",
      className: "upper-section",
      children: [
        createElement({
          tag: "div",
          className: "inner-section",
          children: [
            createElement({
              tag: "div",
              className: "section-header",
              children: [
                createElement({
                  tag: "h3",
                  className: "section-title",
                  text: "Tasks",
                }),
              ],
            }),
          ],
        }),
      ],
    });

    const currentState = store.getState();
    currentState.mainSection.appendChild(tasksContainer);
  }
}
