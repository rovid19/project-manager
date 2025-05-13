import { removeMemberBtn } from "../../../Assets/Icons";
import { ProjectsService } from "../../../Services/ProjectsService";
import { MembersData } from "../../../Types/ProjectsTypes";
import { createElement } from "../../../Utils/Helpers";
import { ProjectView } from "./ProjectView";

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
    console.log(this.teamId);
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
              innerText: this.teamId ? "Remove team" : "Add Team",
              onClick: (e: Event) => {
                e.preventDefault();
                if (!this.teamId) {
                  this.handleChangePopupValue("team");
                  this.handleOpenPopup();
                } else {
                  this.removeTeamFromProject();
                }
              },
            }),
            /*createElement({
              tag: "button",
              className: "add-member",
              innerText: "Add Member",
              onClick: (e: Event) => {
                e.preventDefault();
                this.handleChangePopupValue("member");
                this.handleOpenPopup();
              },
            }),*/
          ],
        }),
      ],
    });

    this.projectContainerElement?.appendChild(projectMemberDiv);
    this.projectMemberDiv = projectMemberDiv;
    this.renderProjectMembers();
  }
  renderProjectMembers = () => {
    // rerender members
    if (document.querySelector(".project-member")) {
      const allMembers = document.querySelectorAll(".project-member");
      allMembers.forEach((member) => {
        member.remove();
      });
      this.renderProjectMembers();
    }
    // render members
    else {
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
                      text: "Team Member",
                    }),
                  ],
                }),
              ],
            }),
            createElement({
              tag: "div",
              className: "member-actions",
              children: [
                createElement({
                  tag: "div",
                  className: "remove-member-btn",
                  innerHTML: removeMemberBtn,
                  onClick: (e: Event) => {
                    const target = e.target as HTMLElement;
                    const memberElement = target.closest(
                      ".project-member"
                    ) as HTMLElement | null;
                    if (memberElement) {
                      this.removeProjectMemberId = memberElement.dataset
                        .projectId as string;
                    }
                    this.removeMemberFromProject();
                    this.cardDeleteAni(element);
                  },
                }),
              ],
            }),
          ],
        });

        this.projectMemberDiv?.appendChild(element);
      });
    }
  };

  //CORE LOGIC------------------------------------------------------

  addDeleteAnimationToEachTeamMember() {
    document.querySelectorAll("member-item").forEach((member) => {
      this.cardDeleteAni(member as HTMLElement);
    });
  }

  //API CALLS------------------------------------------------------
  async removeMemberFromProject() {
    await new ProjectsService(
      "http://localhost:3000/handle-remove-member"
    ).removeMemberFromProject(this.projectId, this.removeProjectMemberId);

    // await this.fetchUserProject();
    setTimeout(() => {
      this.handleManagerClassReset();
    }, 300);
  }

  async removeTeamFromProject() {
    await new ProjectsService(
      `http://localhost:3000/projects/${this.projectId}/remove/${this.teamId}`
    ).removeTeam();

    this.addDeleteAnimationToEachTeamMember();
    setTimeout(() => {
      this.handleManagerClassReset();
    }, 320);
  }
}
