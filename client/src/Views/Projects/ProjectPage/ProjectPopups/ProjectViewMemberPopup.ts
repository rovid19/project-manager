import { createElement } from "../../../../Utils/Helpers";
import "../../../../Styles/ProjectMemberPopup.css";
import { ProjectsService } from "../../../../Services/ProjectsService";
import { MembersData, User } from "../../../../Types/ProjectsTypes";

export class ProjectViewMemberPopup {
  projectId: string = "";
  popupElement: HTMLElement | null = null;
  allUsersArray: User[] = [];
  selectedMemberId: string = "";
  members: string[];
  view: string = "project";
  setProjectDataOnParentController: (newMembers: MembersData[]) => void =
    () => {};
  renderProjectMembers: () => void = () => {};
  handleSelectMember: (e: Event) => void;
  setAllMembers: (userArray: User[]) => void = () => {};
  handleManagerClassReset: () => void = () => {};

  constructor(
    popupElement: HTMLElement,
    view: string,
    projectId: string = "",
    members: string[] = [],
    setProjectDataOnParentController: (
      newMembers: MembersData[]
    ) => void = () => {},
    renderProjectMembers: () => void = () => {},
    handleSelectMember: (e: Event) => void = () => {},
    setAllMembers: (userArray: User[]) => void = () => {},
    handleManagerClassReset: () => void
  ) {
    this.popupElement = popupElement;
    this.view = view;
    this.projectId = projectId;
    this.members = members;
    this.setProjectDataOnParentController = setProjectDataOnParentController;
    this.renderProjectMembers = renderProjectMembers;
    this.createMemberPopup(this.popupElement);
    this.handleSelectMember = handleSelectMember;
    this.setAllMembers = setAllMembers;
    this.handleManagerClassReset = handleManagerClassReset;
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
                if (this.view === "project") this.handleAddMember(e);
                else this.handleSelectMember(e);
              },
              children: [
                createElement({
                  tag: "div",
                  className: "member-avatar",
                  children: [
                    createElement({
                      tag: "span",
                      className: "member-initials",
                      text: user.username
                        ? user.username.charAt(0).toUpperCase()
                        : user.username,
                    }),
                  ],
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
    // if (this.view === "team") this.setAllMembers(this.allUsersArray);
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

    console.log(result);

    this.setProjectDataOnParentController(result.membersData);
    this.handleRemovePopup();
    this.handleManagerClassReset();
  }

  handleRemovePopup() {
    document.querySelector(".popup-overlay")?.remove();
  }

  async getAllUsers() {
    let apiCall = new ProjectsService("http://localhost:3000/get-all-users");

    const result = await apiCall.getAllUsers(this.members);

    console.log(result);

    (result as User[]).forEach((item) => this.allUsersArray.push(item));
  }
}
