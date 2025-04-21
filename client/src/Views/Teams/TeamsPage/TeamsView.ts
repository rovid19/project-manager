import { store } from "../../../Store/Store";
import { createElement } from "../../../Utils/Helpers";
import "../../../Styles/Teams.css";
import "../../../Styles/SharedStylings/SectionHeader.css";
import "../../../Styles/SharedStylings/UpperInnerSection.css";
import { CreateNewTeamPopup } from "./CreateNewTeamPopup";
import { TeamsService } from "../../../Services/TeamsService";
import { router } from "../../../main";
import { Team } from "../../../Types/TeamsTypes";

export class TeamsView {
  popupController: CreateNewTeamPopup | null = null;
  allTeamsLeader: Team[] = [];
  allTeamsParticipant: Team[] = [];
  teamLeaderContainer: HTMLElement | null = null;
  teamParticipantContainer: HTMLElement | null = null;
  constructor() {}

  //UI RENDER------------------------------------------------------
  delete() {
    document.querySelector(".upper-section")?.remove();
  }

  async renderTeams() {
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
                  text: "Teams",
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
    this.renderTeamCard(
      this.allTeamsParticipant,
      this.teamParticipantContainer as HTMLElement
    );
    this.renderTeamCard(
      this.allTeamsLeader,
      this.teamLeaderContainer as HTMLElement
    );
  };

  renderTeamCard = (teamArray: Team[], parentElement: HTMLElement) => {
    teamArray.forEach((team) => {
      const mainElement = createElement({
        tag: "div",
        className: "team-card",
        onClick: () => {
          router.route(`/teams/${team.teamId}`);
          history.pushState("", "", `/teams/${team.teamId}`);
        },
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

  //CORE LOGIC-----------------------------------------------------
  handleCreateTeamPopup() {
    this.popupController = new CreateNewTeamPopup(
      this.renderTeamCards,
      this.fetchAllTeams
    );
  }

  handleClosePopup = () => {
    this.popupController = null;
    document.querySelector(".popup-overlay")?.remove();
  };

  //API CALLS------------------------------------------------------
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
  };
}
