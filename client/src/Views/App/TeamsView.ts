import { store } from "../../Store/Store";
import { createElement } from "../../Utils/Helpers";
import "../../Styles/Teams.css";
import "../../Styles/SharedStylings/SectionHeader.css";
import "../../Styles/SharedStylings/UpperInnerSection.css";
import { TeamsPopupView } from "../TeamsExtraViews/TeamsPopupView";
import { TeamsService } from "../../Services/TeamsService";

export type Team = {
  teamName: string;
  teamDescription: string;
  teamId: string;
  isAdmin: boolean;
};

export class TeamsView {
  popupController: TeamsPopupView | null = null;
  allTeamsLeader: Team[] = [];
  allTeamsParticipant: Team[] = [];
  teamLeaderContainer: HTMLElement | null = null;
  teamParticipantContainer: HTMLElement | null = null;
  constructor() {}
  delete() {
    document.querySelector(".upper-section")?.remove();
  }

  fetchAllTeams = async () => {
    this.allTeamsLeader = [];
    this.allTeamsParticipant = [];

    const result = await new TeamsService(
      `http://localhost:3000/get-all-user-teams`
    ).fetchAllTeams();

    result.forEach((team) => {
      if (team.isAdmin) this.allTeamsLeader.push(team);
      else this.allTeamsParticipant.push(team);
    });

    console.log(result);
  };
  async createTeams() {
    await this.fetchAllTeams();
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
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    this.teamLeaderContainer = teamsSection.children[0].children[1]
      .children[1] as HTMLElement;
    this.teamParticipantContainer = teamsSection.children[0].children[1]
      .children[0] as HTMLElement;

    this.renderTeamCards();

    const currentState = store.getState();
    currentState.mainSection?.appendChild(teamsSection);
  }

  deleteTeamCards = () => {
    document.querySelectorAll(".team-card").forEach((card) => card.remove());
  };

  renderTeamCards = () => {
    console.log("renderTeamCards");
    this.createTeamCard(
      this.allTeamsParticipant,
      this.teamParticipantContainer as HTMLElement
    );
    this.createTeamCard(
      this.allTeamsLeader,
      this.teamLeaderContainer as HTMLElement
    );

    console.log(this.allTeamsLeader, this.teamLeaderContainer);
  };

  createTeamCard = (teamArray: Team[], parentElement: HTMLElement) => {
    teamArray.forEach((team) => {
      const mainElement = createElement({
        tag: "div",
        className: "team-card",
        onClick: () => console.log(`Team ${team.teamName} clicked`),
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
                    text: team.teamName.charAt(0).toUpperCase(),
                  }),
                ],
              }),
              createElement({
                tag: "h4",
                className: "team-name",
                text: team.teamName,
              }),
            ],
          }),
          createElement({
            tag: "div",
            className: "team-info",
            children: [
              createElement({
                tag: "span",
                className: `team-role${team.isAdmin ? "leader" : "member"}`,
                text: team.isAdmin ? "Team Leader" : "Team Member",
              }),
              createElement({
                tag: "div",
                className: "team-stats",
                children: [
                  createElement({
                    tag: "span",
                    text: `${2} members`,
                  }),
                  createElement({
                    tag: "span",
                    text: `${3} projects`,
                  }),
                ],
              }),
            ],
          }),
        ],
      });

      parentElement.appendChild(mainElement);
    });
  };

  handleCreateTeamPopup() {
    this.popupController = new TeamsPopupView(
      this.renderTeamCards,
      this.fetchAllTeams
    );
  }

  closePopup = () => {
    this.popupController = null;
    document.querySelector(".popup-overlay")?.remove();
  };
}
