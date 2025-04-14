import { createElement } from "../../Utils/Helpers";
import "../../Styles/Reports.css";
import "../../Styles/SharedStylings/SectionHeader.css";
import "../../Styles/SharedStylings/UpperInnerSection.css";

import { store } from "../../store/store";

export class ReportsView {
  constructor() {}
  delete() {
    document.querySelector(".upper-section")?.remove();
  }
  createReports() {
    const reportsContainer = createElement({
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
                  text: "Reports",
                }),
              ],
            }),
          ],
        }),
      ],
    });

    const currentState = store.getState();
    currentState.mainSection.appendChild(reportsContainer);
  }
}
