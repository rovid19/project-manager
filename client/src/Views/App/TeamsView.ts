import { store } from "../../Store/Store";
import { createElement } from "../../Utils/Helpers";
import "../../Styles/Teams.css";
import "../../Styles/SharedStylings/SectionHeader.css";
import "../../Styles/SharedStylings/UpperInnerSection.css";
import { TeamsPopupView } from "../TeamsPopupView/TeamsPopupView";

export class TeamsView {
  popupController: TeamsPopupView | null = null;
  constructor() {}
  delete() {
    document.querySelector(".upper-section")?.remove();
  }
  createTeams() {
    const teamsSection = createElement({
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
                  text: "Reports",
                }),
                createElement({
                  tag: "button",
                  className: "create-team-btn",
                  text: "Create New Team",
                  onClick: () => this.handleCreateTeamPopup(),
                }),
              ],
            }),
            createElement({
              tag: "div",
              className: "teams-container",
              children: [
                createElement({
                  tag: "div",
                  className: "teams-box-member-teams",
                  children: [
                    createElement({
                      tag: "h3",
                      className: "teams-box-title",
                      text: "Teams You Participate In",
                    }),
                    createElement({
                      tag: "div",
                      className: "teams-grid",
                      children: [
                        this.createTeamCard("Development Team", 8, 3),
                        this.createTeamCard("Design Squad", 5, 2),
                      ],
                    }),
                  ],
                }),
                createElement({
                  tag: "div",
                  className: "teams-box-leader-teams",
                  children: [
                    createElement({
                      tag: "h3",
                      className: "teams-box-title",
                      text: "Teams You Lead",
                    }),
                    createElement({
                      tag: "div",
                      className: "teams-grid",
                      children: [
                        this.createTeamCard("Frontend Team", 6, 4, true),
                        this.createTeamCard("Backend Team", 7, 3, true),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    const currentState = store.getState();
    currentState.mainSection?.appendChild(teamsSection);
  }

  private createTeamCard(
    name: string,
    members: number,
    projects: number,
    isLeader: boolean = false
  ) {
    return createElement({
      tag: "div",
      className: "team-card",
      onClick: () => console.log(`Team ${name} clicked`),
      children: [
        createElement({
          tag: "div",
          className: "team-card-header",
          children: [
            createElement({
              tag: "div",
              className: "team-avatar",
              children: [
                createElement({
                  tag: "span",
                  text: name.charAt(0).toUpperCase(),
                }),
              ],
            }),
            createElement({
              tag: "h4",
              className: "team-name",
              text: name,
            }),
          ],
        }),
        createElement({
          tag: "div",
          className: "team-info",
          children: [
            createElement({
              tag: "span",
              className: `team-role${isLeader ? "leader" : "member"}`,
              text: isLeader ? "Team Leader" : "Team Member",
            }),
            createElement({
              tag: "div",
              className: "team-stats",
              children: [
                createElement({
                  tag: "span",
                  text: `${members} members`,
                }),
                createElement({
                  tag: "span",
                  text: `${projects} projects`,
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }

  handleCreateTeamPopup() {
    console.log("yp");
    this.popupController = new TeamsPopupView();
  }

  closePopup = () => {
    this.popupController = null;
    document.querySelector(".popup-overlay")?.remove();
  };
}
