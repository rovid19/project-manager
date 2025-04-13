import { store } from "../../store/Store";
import { createElement } from "../../Utils/Helpers";
import "../../Styles/Teams.css";
import "../../Styles/SharedStylings/SectionHeader.css";
import "../../Styles/SharedStylings/UpperInnerSection.css";

export class TeamsView {
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
                  text: "My Teams",
                }),
                createElement({
                  tag: "button",
                  className: "create-team-btn",
                  text: "Create New Team",
                  //onClick: () => this.handleCreateTeamPopup()
                }),
              ],
            }),
            createElement({
              tag: "div",
              className: "teams-grid",
              /*children: this.teams.map(team => 
              createElement({
                tag: "div",
                className: "team-card",
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
                            text: team.name.charAt(0).toUpperCase()
                          })
                        ]
                      }),
                      createElement({
                        tag: "h3",
                        className: "team-name",
                        text: team.name
                      })
                    ]
                  }),
                  createElement({
                    tag: "div",
                    className: "team-info",
                    children: [
                      createElement({
                        tag: "span",
                        className: "team-role",
                        text: team.isManager ? "Team Manager" : "Team Member"
                      }),
                      createElement({
                        tag: "span",
                        className: "member-count",
                        text: `${team.memberCount} members`
                      })
                    ]
                  }),
                  createElement({
                    tag: "div",
                    className: "team-actions",
                    children: [
                      createElement({
                        tag: "button",
                        className: "view-team-btn",
                        text: "View Details",
                        //onClick: () => this.handleViewTeam(team.id)
                      })
                    ]
                  })
                ]
              })
            )*/
            }),
          ],
        }),
      ],
    });

    const currentState = store.getState();
    currentState.mainSection?.appendChild(teamsSection);
  }
}
