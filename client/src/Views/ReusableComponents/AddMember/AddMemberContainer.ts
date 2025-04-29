import { createElement } from "../../../Utils/Helpers";
import "../../../Styles/Views/Projects/Project/ProjectMemberPopup.css";
import { ProjectsService } from "../../../Services/ProjectsService";
import { MembersData, User } from "../../../Types/ProjectsTypes";
import { SelectedMember } from "../../Teams/TeamsPage/CreateNewTeamPopup";
import { TeamMember } from "../../../Types/TeamsTypes";

export class AddMemberContainer {
  projectId: string = "";
  teamId: string = "";
  popupElement: HTMLElement;
  allUsersArray: User[] = [];
  selectedMemberId: string = "";
  members: string[];
  view: string = "project";
  setProjectDataOnParentController: (newMembers: MembersData[]) => void;
  handleManagerClassReset: () => Promise<void>;
  setSelectedMembers: (selectedMembers: SelectedMember[]) => void;
  closePopup: () => void;

  constructor(
    popupElement: HTMLElement,
    teamId: string,
    view: string,
    projectId: string = "",
    members: string[] = [],
    setProjectDataOnParentController: (newMembers: MembersData[]) => void,
    handleManagerClassReset: () => Promise<void>,
    setSelectedMembers: (selectedMembers: SelectedMember[]) => void,
    closePopup: () => void
  ) {
    this.popupElement = popupElement;
    this.teamId = teamId;
    this.view = view;
    this.projectId = projectId;
    this.members = members;
    this.setProjectDataOnParentController = setProjectDataOnParentController;
    this.handleManagerClassReset = handleManagerClassReset;
    this.setSelectedMembers = setSelectedMembers;
    this.closePopup = closePopup;
    this.setupMemberPopupClass();
  }

  //UI RENDER------------------------------------------------------
  async renderMemebersContainer() {
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

    this.popupElement.appendChild(memberContainer);
  }

  //CORE LOGIC------------------------------------------------------
  async setupMemberPopupClass() {
    this.renderMemebersContainer();
    if (this.view === "createNewTeam") {
      const { AddMemberCreateTeamPopup } = await import(
        "./AddMemberCreateTeamPopup"
      );
      new AddMemberCreateTeamPopup(this.popupElement, this.setSelectedMembers);
    } else if (this.view === "project") {
      const { AddMemberProjectPopup } = await import("./AddMemberProjectPopup");
      new AddMemberProjectPopup(
        this.popupElement,
        this.view,
        this.projectId,
        this.members,
        this.setProjectDataOnParentController,
        this.handleManagerClassReset,
        this.closePopup
      );
    } else {
      const { AddMemberEditTeam } = await import("./AddMemberEditTeam");
      new AddMemberEditTeam(
        this.popupElement,
        this.teamId,
        this.handleManagerClassReset
      );
    }
  }

  //API CALLS--------------------------------------------------------
  async getAllUsers() {
    let apiCall = new ProjectsService("http://localhost:3000/get-all-users");

    const result = await apiCall.getAllUsers(this.members);

    (result as User[]).forEach((item) => this.allUsersArray.push(item));
  }
}
