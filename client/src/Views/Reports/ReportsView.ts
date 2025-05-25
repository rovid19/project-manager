import { createElement, createReusableHeader } from "../../Utils/Helpers";
import "../../Styles/Views/Reports/Reports.css";
import "../../Styles/SharedStylings/SectionHeader.css";
import "../../Styles/SharedStylings/UpperInnerSection.css";

import { store } from "../../Store/Store";
import { router } from "../../main";

export class ReportsView {
  constructor() {}

  //UI RENDER------------------------------------------------------
  createReports() {
    const reportsContainer = createElement({
      tag: "div",
      className: "upper-section",
      children: [
        createReusableHeader(
          () => {
            history.pushState("", "", "/dashboard");
            router.route("dashboard");
          },
          "Reports",
          "Track your progress and get insights about your projects and tasks",
          async () => {},
          "reports"
        ),
        createElement({
          tag: "div",
          className: "reports-content",
          children: [
            createElement({
              tag: "div",
              className: "coming-soon-message",
              children: [
                createElement({
                  tag: "h2",
                  text: "Reports Coming Soon",
                }),
                createElement({
                  tag: "p",
                  text: "We're working on bringing you detailed reports and analytics for your projects and tasks.",
                }),
              ],
            }),
          ],
        }),
      ],
    });

    console.log(reportsContainer);

    const currentState = store.getState();
    currentState.mainSection.appendChild(reportsContainer);
  }

  //CORE LOGIC------------------------------------------------------
  delete() {
    document.querySelector(".upper-section")?.remove();
  }
}
