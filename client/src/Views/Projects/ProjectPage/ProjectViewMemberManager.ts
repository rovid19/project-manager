import { ProjectsService } from "../../../Services/ProjectsService";
import { MembersData } from "../../../Types/ProjectsTypes";
import { createElement } from "../../../Utils/Helpers";
import { ProjectView } from "./ProjectView";
import "../../../Styles/Views/Projects/Project/Project.css";

export class ProjectViewMemberManager extends ProjectView {
  projectId: string = "";
  membersData: MembersData[] = [];
  removeProjectMemberId: string = "";
  projectContainerElement: HTMLElement | null = null;
  projectMemberDiv: HTMLElement | null = null;
  teamId: string = "";
  handleOpenPopup: () => void = () => {};
  handleChangePopupValue: (value: string) => void;
  handleManagerClassReset: () => Promise<void>;

  constructor(
    membersData: MembersData[],
    projectId: string,
    projectContainerElement: HTMLElement,
    teamId: string,
    handleOpenPopup: () => void,
    handleChangePopupValue: (value: string) => void,
    handleManagerClassReset: () => Promise<void>
  ) {
    super();
    this.projectId = projectId;
    this.membersData = membersData;
    this.projectContainerElement = projectContainerElement;
    this.teamId = teamId;
    this.handleOpenPopup = handleOpenPopup;
    this.handleChangePopupValue = handleChangePopupValue;
    this.handleManagerClassReset = handleManagerClassReset;
    this.renderProjectMemberDiv();
  }

  //UI RENDER------------------------------------------------------
  renderProjectMemberDiv() {
    const projectMemberDiv = createElement({
      tag: "div",
      className: "project-members-div",
      children: [
        createElement({
          tag: "div",
          className: "project-member-btn-div",
          children: [
            createElement({
              tag: "button",
              className: "add-team",
              innerText: this.teamId === "noTeam" ? "Add Team" : "Remove Team",
              onClick: (e: Event) => {
                e.preventDefault();
                if (this.teamId === "noTeam") {
                  this.handleChangePopupValue("team");
                  this.handleOpenPopup();
                } else {
                  this.removeTeamFromProject();
                }
              },
            }),
          ],
        }),
      ],
    });

    this.projectContainerElement?.appendChild(projectMemberDiv);
    this.projectMemberDiv = projectMemberDiv;

    // Check if there are members to display
    if (this.membersData.length > 0) {
      this.renderProjectMembers();
    } else {
      // Display empty state
      const emptyState = createElement({
        tag: "div",
        className: "empty-state",
        children: [
          createElement({
            tag: "div",
            className: "empty-icon",
            innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
          }),
          createElement({
            tag: "p",
            className: "empty-text",
            text: "No members in this project yet",
          }),
        ],
      });

      (this.projectMemberDiv as HTMLElement).appendChild(emptyState);
    }
  }

  renderProjectMembers = () => {
    // Clear existing members if any
    if (this.projectMemberDiv) {
      const existingMembers =
        this.projectMemberDiv.querySelectorAll(".project-member");
      existingMembers.forEach((member) => member.remove());

      // Remove empty state if it exists
      const emptyState = this.projectMemberDiv.querySelector(".empty-state");
      if (emptyState) {
        emptyState.remove();
      }
    }

    // Render members
    this.membersData.forEach((member) => {
      const element = createElement({
        tag: "div",
        className: "project-member",
        data: member.userId,
        children: [
          createElement({
            tag: "div",
            className: "member-content",
            children: [
              createElement({
                tag: "div",
                className: "member-avatar",
                children: [
                  createElement({
                    tag: "span",
                    className: "member-initials",
                    text: member.username.charAt(0).toUpperCase(),
                  }),
                ],
              }),
              createElement({
                tag: "div",
                className: "member-info",
                children: [
                  createElement({
                    tag: "h3",
                    className: "member-name",
                    text: member.username,
                  }),
                  createElement({
                    tag: "span",
                    className: "member-email",
                    text: member.email,
                  }),
                  createElement({
                    tag: "span",
                    className: "member-role",
                    text: member.isAdmin ? "Admin" : "Team Member",
                  }),
                ],
              }),
            ],
          }),
        ],
      });

      this.projectMemberDiv?.appendChild(element);
    });
  };

  //CORE LOGIC------------------------------------------------------

  addDeleteAnimationToEachTeamMember() {
    document.querySelectorAll("member-item").forEach((member) => {
      //this.cardDeleteAni(member as HTMLElement);
    });
  }

  //API CALLS------------------------------------------------------

  async removeTeamFromProject() {
    await new ProjectsService(
      `http://localhost:3000/projects/${this.projectId}/remove/${this.teamId}`
    ).removeTeam();
    window.history.replaceState(null, "", `/projects/${this.projectId}/noTeam`);

    this.handleManagerClassReset();
  }
}
