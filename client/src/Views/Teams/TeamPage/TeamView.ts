import { createElement } from "../../../Utils/Helpers";
import "../../../Styles/SharedStylings/UpperInnerSection.css";
import "../../../Styles/SharedStylings/SectionHeader.css";
import "../../../Styles/Views/Teams/Team/Team.css";
import { store } from "../../../Store/Store";
import { TeamMember } from "../../../Types/TeamsTypes";
import type { TeamSettingsManager } from "./TeamSettingsManager";
import type { TeamMembersManager } from "./TeamMembersManager";
import { TeamsService } from "../../../Services/TeamsService";
import { router } from "../../../main";

export class TeamView {
  teamMembers: TeamMember[] = [];
  teamName: string = "";
  teamDescription: string = "";
  teamId: string = "";
  teamSettingsManager: TeamSettingsManager | null = null;
  teamMembersManager: TeamMembersManager | null = null;
  innerSection: HTMLElement | null = null;

  constructor() {}

  //UI RENDER------------------------------------------------------
  delete() {
    document.querySelector(".upper-section")?.remove();
  }

  renderTeam() {
    const teamPage = createElement({
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
                  className: "delete-team-btn",
                  text: "Delete",
                  onClick: () => this.submitDeleteProject(),
                }),
              ],
            }),
            createElement({
              tag: "div",
              className: "team-management-container",
            }),
          ],
        }),
      ],
    });

    this.innerSection = teamPage.children[0].children[1];
    store.getState().mainSection.appendChild(teamPage);
    this.handleGetTeamIdFromUrl();
    this.handleManagerClassSetup();
  }

  //CORE LOGIC-----------------------------------------------------

  async handleManagerClassSetup() {
    await this.fetchTeam();
    console.log(this.teamMembers);
    const { TeamSettingsManager } = await import("./TeamSettingsManager");
    const { TeamMembersManager } = await import("./TeamMembersManager");
    this.teamSettingsManager = new TeamSettingsManager(
      this.innerSection as HTMLElement,
      this.handleManagerClassReset,
      this.teamId
    );
    this.teamMembersManager = new TeamMembersManager(
      this.innerSection as HTMLElement,
      this.handleManagerClassReset,
      this.teamId,
      this.teamMembers
    );
  }

  handleManagerClassReset = async () => {
    console.log("ran");
    this.teamSettingsManager = null;
    this.teamMembersManager = null;
    (document.querySelector(".team-settings-section") as HTMLElement).remove();
    (document.querySelector(".team-members-section") as HTMLElement).remove();
    await this.handleManagerClassSetup();
  };

  async submitDeleteProject() {
    await new TeamsService(
      `http://localhost:3000/team/${this.teamId}/delete`
    ).deleteTeam();
    history.pushState("", "", "/teams");
    router.route("teams");
  }

  handleGetTeamIdFromUrl() {
    this.teamId = window.location.pathname.split("/")[2];
  }

  handleSetTeamDetails(
    teamName: string,
    teamDescription: string,
    teamMembers: TeamMember[]
  ) {
    this.teamName = teamName;
    this.teamDescription = teamDescription;
    this.teamMembers = teamMembers;
  }

  handleSetTeamNameInHeaderSection() {
    const headerTitle = document.querySelector(".section-title") as HTMLElement;
    headerTitle.textContent = this.teamName;
  }

  async fetchTeam() {
    const teamData = await new TeamsService(
      `http://localhost:3000/fetch-specific-team/${this.teamId}`
    ).getTeam();

    this.handleSetTeamDetails(
      teamData.team[0].teamName,
      teamData.team[0].teamDescription,
      teamData.teamMembers
    );

    console.log(this.teamMembers);
    this.handleSetTeamNameInHeaderSection();
  }

  async fetchTeamMembers() {}
}
