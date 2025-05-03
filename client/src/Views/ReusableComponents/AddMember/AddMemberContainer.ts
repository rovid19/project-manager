import { countTeamMembers, createElement } from "../../../Utils/Helpers";
import "../../../Styles/Views/Projects/Project/ProjectMemberPopup.css";
import { ProjectsService } from "../../../Services/ProjectsService";
import { MembersData, User } from "../../../Types/ProjectsTypes";
import { SelectedMember } from "../../Teams/TeamsPage/CreateNewTeamPopup";
import { store } from "../../../Store/Store";
import { userStore } from "../../../Store/UserStore";

export class AddMemberContainer {
  popupState: string = "";
  projectId: string = "";
  teamId: string = "";
  popupElement: HTMLElement;
  allUsersArray: User[] = [];
  allTeamsArray: any = [];
  selectedMemberId: string = "";
  members: string[];
  view: string = "project";
  setProjectDataOnParentController: (newMembers: MembersData[]) => void;
  handleManagerClassReset: () => Promise<void>;
  setSelectedMembers: (selectedMembers: SelectedMember[]) => void;
  closePopup: () => void;

  constructor(
    popupState: string,
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
    this.popupState = popupState;
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
    if (this.popupState === "team") await this.getAllTeams();

    const memberContainer = createElement({
      tag: "div",
      className: "member-container",
      children: [
        createElement({
          tag: "h3",
          className: "member-popup-title",
          text: this.popupState === "team" ? "Add Team:" : "Add Members:",
        }),
        createElement({
          tag: "div",
          className: "member-list",
          children: this.handleTeamOrMembersRender(),
        }),
      ],
    });

    this.popupElement.appendChild(memberContainer);
  }

  renderItems(itemArray: any) {
    return itemArray.map((item: any) => {
      console.log(item);
      return createElement({
        tag: "div",
        className: "member-item",
        data: item.userId ? item.userId : item.teamId,
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
                text: item.username
                  ? item.username.charAt(0).toUpperCase()
                  : item.teamName.charAt(0).toUpperCase(),
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
                text: item.username ? item.username : item.teamName,
              }),
              createElement({
                tag: "div",
                className: "member-email",
                text: item.email
                  ? item.email
                  : countTeamMembers(item.teamMembers) + " Members",
              }),
            ],
          }),
        ],
      });
    });
  }

  renderTeams() {}

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
        this.popupState,
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

  handleTeamOrMembersRender() {
    if (this.popupState === "team") return this.renderItems(this.allTeamsArray);
    else return this.renderItems(this.allUsersArray);
  }

  //API CALLS--------------------------------------------------------
  async getAllUsers() {
    let apiCall = new ProjectsService("http://localhost:3000/get-all-users");
    console.log(this.members);
    const result = await apiCall.getAllUsers(this.members);

    (result as User[]).forEach((item) => this.allUsersArray.push(item));
  }

  async getAllTeams() {
    let result = await new ProjectsService(
      `http://localhost:3000/user/${userStore.getState().userId}/get/teams`
    ).getAllTeams();

    console.log(result);
    result.allTeams.forEach((item: any) => this.allTeamsArray.push(item));
    result = null;
  }
}
