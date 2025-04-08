import { createElement } from "../../Utils/Helpers";
import "../../Styles/ProjectMemberPopup.css";
import { ProjectsService } from "../../Services/ProjectsService";

import { Project, ProjectData } from "../../Store/UserStore";

type User = {
  userId: string;
  username: string;
  email: string;
};

export class ProjectPopupMemberController {
  projectId: string = "";
  popupElement: HTMLElement | null = null;
  allUsersArray: User[] = [];
  selectedMemberId: string = "";
  members: string[] = [""];
  setProjectDataOnParentController: (projectData: ProjectData) => void =
    () => {};
  renderProjectMembers: () => void = () => {};

  constructor(
    popupElement: HTMLElement,
    projectId: string,
    members: string[],
    setProjectDataOnParentController: (projectData: ProjectData) => void,
    renderProjectMembers: () => void
  ) {
    this.popupElement = popupElement;
    this.projectId = projectId;
    this.members = members;
    this.setProjectDataOnParentController = setProjectDataOnParentController;
    this.renderProjectMembers = renderProjectMembers;
    this.createMemberPopup(this.popupElement);
  }

  async createMemberPopup(popupMainDiv: Element) {
    await this.getAllUsers();

    const memberContainer = createElement({
      tag: "div",
      className: "member-container",
      children: [
        createElement({
          tag: "h3",
          className: "member-popup-title",
          text: "Add Member:",
        }),
        createElement({
          tag: "div",
          className: "member-list",
          children: this.allUsersArray.map((user) =>
            createElement({
              tag: "div",
              className: "member-item",
              data: user.userId,
              onClick: (e: Event) => {
                e.preventDefault();
                this.handleAddMember(e);
              },
              children: [
                createElement({
                  tag: "img",
                  className: "member-picture",
                  src: "path/to/default-avatar.png",
                  alt: "Member avatar",
                }),
                createElement({
                  tag: "div",
                  className: "member-info",
                  children: [
                    createElement({
                      tag: "div",
                      className: "member-name",
                      text: user.username,
                    }),
                    createElement({
                      tag: "div",
                      className: "member-email",
                      text: user.email,
                    }),
                  ],
                }),
              ],
            })
          ),
        }),
      ],
    });

    popupMainDiv.appendChild(memberContainer);
    // this.memberListEventDelegation(memberContainer.children[1]);
  }

  private async handleAddMember(e: Event) {
    const target = e.target as HTMLElement;
    this.selectedMemberId = (target.closest(".member-item") as HTMLElement)
      .dataset.projectId as string;
    await new ProjectsService(
      "http://localhost:3000/handle-add-member-to-project"
    ).handleAddMember(this.selectedMemberId, this.projectId);
    const result = await new ProjectsService(
      `http://localhost:3000/get-project/${this.projectId}`
    ).fetchUserProject();

    this.setProjectDataOnParentController(result);
    this.handleRemovePopup();
    this.renderProjectMembers();
  }

  handleRemovePopup() {
    document.querySelector(".popup-overlay")?.remove();
  }

  async getAllUsers() {
    let apiCall = new ProjectsService("http://localhost:3000/get-all-users");
    const result = await apiCall.getAllUsers(this.members);

    (result as User[]).forEach((item) => this.allUsersArray.push(item));
  }
}
