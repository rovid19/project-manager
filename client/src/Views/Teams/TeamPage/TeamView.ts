import { createElement } from "../../../Utils/Helpers";
import "../../../Styles/SharedStylings/UpperInnerSection.css";
import "../../../Styles/SharedStylings/SectionHeader.css";
import "../../../Styles/Team.css";
import { store } from "../../../Store/Store";
import { TeamMember } from "../../../Types/TeamsTypes";
import type { TeamSettingsManager } from "./TeamSettingsManager";
import type { TeamMembersManager } from "./TeamMembersManager";
import { TeamsService } from "../../../Services/TeamsService";

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
                  // onClick: () => this.handleCreateTeamPopup(),
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
      this.teamId
    );
  }

  handleManagerClassReset = async () => {
    this.teamSettingsManager = null;
    this.teamMembersManager = null;
    (document.querySelector(".team-settings-section") as HTMLElement).remove();
    (document.querySelector(".team-members-section") as HTMLElement).remove();
    await this.handleManagerClassSetup();
  };

  private saveTeamInfo() {
    console.log("Saving team info:", this.teamName, this.teamDescription);
  }

  private makeAdmin(userId: string) {
    console.log("Making user admin:", userId);
    // Implement API call to make user admin
  }

  private removeMember(userId: string) {
    console.log("Removing member:", userId);
    // Implement API call to remove member
  }

  private openAddMembersPopup() {
    console.log("Opening add members popup");
    // Implement popup to add members
  }

  handleGetTeamIdFromUrl() {
    this.teamId = window.location.pathname.split("/")[2];
  }

  handleSetTeamDetails(teamName: string, teamDescription: string) {
    this.teamName = teamName;
    this.teamDescription = teamDescription;
  }

  handleSetTeamNameInHeaderSection() {
    const headerTitle = document.querySelector(".section-title") as HTMLElement;
    headerTitle.textContent = this.teamName;
  }

  async fetchTeam() {
    const team = await new TeamsService(
      `http://localhost:3000/fetch-specific-team/${this.teamId}`
    ).getTeam();

    this.handleSetTeamDetails(team[0].teamName, team[0].teamDescription);
    this.handleSetTeamNameInHeaderSection();
  }

  async fetchTeamMembers() {}
}
