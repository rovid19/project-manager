import { createElement } from "../../Utils/Helpers";
import "../../Styles/ProjectMemberPopup.css";
import { ProjectsService } from "../../Services/ProjectsService";

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

  constructor(popupElement: HTMLElement, projectId: string) {
    this.popupElement = popupElement;
    this.projectId = projectId;

    this.createMemberPopup(this.popupElement);
  }

  async createMemberPopup(popupMainDiv: Element) {
    await this.fetchAllUsers();

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
    this.memberListEventDelegation(memberContainer.children[1]);
  }

  private handleAddMember() {
    console.log("Add new member clicked");
  }

  memberListEventDelegation(memberList: HTMLElement) {
    memberList.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;
      this.selectedMemberId = (target.closest(".member-item") as HTMLElement)
        .dataset.projectId as string;
    });
  }

  async fetchAllUsers() {
    let apiCall = new ProjectsService("http://localhost:3000/get-all-users");
    const result = await apiCall.getAllUsers();

    (result as User[]).forEach((item) => this.allUsersArray.push(item));
  }
}
