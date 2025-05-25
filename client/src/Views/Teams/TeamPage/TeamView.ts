import { createElement, createReusableHeader } from "../../../Utils/Helpers";
import "../../../Styles/SharedStylings/UpperInnerSection.css";
import "../../../Styles/SharedStylings/SectionHeader.css";
import "../../../Styles/Views/Teams/Team/Team.css";
import { store } from "../../../Store/Store";
import { TeamMember } from "../../../Types/TeamsTypes";
import type { TeamSettingsManager } from "./TeamSettingsManager";
import type { TeamMembersManager } from "./TeamMembersManager";
import { TeamsService } from "../../../Services/TeamsService";
import { router } from "../../../main";
import "../../../Styles/Views/Projects/Project/Project.css";

export class TeamView {
  teamMembers: TeamMember[] = [];
  teamName: string = "";
  teamDescription: string = "";
  teamId: string = "";
  teamSettingsManager: TeamSettingsManager | null = null;
  teamMembersManager: TeamMembersManager | null = null;
  mainSection: HTMLElement | null = null;
  innerSection: HTMLElement | null = null;

  constructor() {}

  //UI RENDER------------------------------------------------------
  delete() {
    document.querySelector(".upper-section")?.remove();
  }

  async renderTeam() {
    await this.fetchTeam();

    const teamPage = createElement({
      tag: "div",
      className: "upper-section",
      children: [
        createElement({
          tag: "section",
          className: "inner-section",
        }),
      ],
    });

    this.mainSection = teamPage.children[0];

    //create header and container
    this.createTeamHeader();
    this.createTeamContainer();

    store.getState().mainSection.appendChild(teamPage);

    this.handleGetTeamIdFromUrl();
    this.handleManagerClassSetup();
  }

  createTeamHeader() {
    const pageHeader = createReusableHeader(
      this.redirectBackToTeams,
      this.teamName,
      this.teamDescription,
      this.submitDeleteProject,
      "team"
    );
    this.mainSection?.appendChild(pageHeader);
  }

  createTeamContainer() {
    const teamContainer = createElement({
      tag: "div",
      className: "team-management-container",
    });
    this.mainSection?.appendChild(teamContainer);

    this.innerSection = teamContainer;
  }

  //CORE LOGIC-----------------------------------------------------

  async handleManagerClassSetup() {
    this.handleSetTeamNameInHeaderSection();

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
    //delete team header and managers
    (document.querySelector(".projectHeader") as HTMLElement).remove();
    this.teamSettingsManager = null;
    this.teamMembersManager = null;
    (
      document.querySelector(".team-management-container") as HTMLElement
    ).remove();

    // load team data
    await this.fetchTeam();

    // add header back in with managers
    this.createTeamHeader();
    this.createTeamContainer();
    await this.handleManagerClassSetup();
  };

  submitDeleteProject = async () => {
    await new TeamsService(
      `http://localhost:3000/team/${this.teamId}/delete`
    ).deleteTeam();
    history.pushState("", "", "/teams");
    router.route("teams");
  };

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

  redirectBackToTeams() {
    history.pushState("", "", "/teams");
    router.route("teams");
  }

  handleSetTeamNameInHeaderSection() {
    const headerTitle = document.querySelector(".projectTitle") as HTMLElement;
    headerTitle.textContent = this.teamName;
  }

  async fetchTeam() {
    this.teamId = window.location.pathname.split("/")[2];

    const teamData = await new TeamsService(
      `http://localhost:3000/fetch-specific-team/${this.teamId}`
    ).getTeam();

    this.handleSetTeamDetails(
      teamData.team[0].teamName,
      teamData.team[0].teamDescription,
      teamData.teamMembers
    );
  }
}
