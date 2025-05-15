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

    const searchInput = createElement({
      tag: "input",
      className: "member-search-input",
      type: "text",
      placeholder:
        this.popupState === "team" ? "Search teams..." : "Search members...",
      oninput: (e: Event) => this.handleSearch(e),
    });

    const memberContainer = createElement({
      tag: "div",
      className: "member-container",
      children: [
        createElement({
          tag: "h3",
          className: "member-popup-title",
          text: this.popupState === "team" ? "Add Team" : "Add Members",
        }),
        createElement({
          tag: "div",
          className: "member-search-container",
          children: [searchInput],
        }),
        createElement({
          tag: "div",
          className: "member-list-container",
          children: [
            createElement({
              tag: "div",
              className: "member-list",
              children: this.handleTeamOrMembersRender(),
            }),
          ],
        }),
      ],
    });
    console.log(this.popupElement);
    this.popupElement.appendChild(memberContainer);
  }

  renderItems(itemArray: any) {
    if (itemArray.length === 0) {
      return [
        createElement({
          tag: "div",
          className: "no-members-message",
          text:
            this.popupState === "team"
              ? "No teams available"
              : "No members available",
        }),
      ];
    }

    return itemArray.map((item: any) => {
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
        this.teamId,
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

  handleSearch(e: Event) {
    const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
    const memberList = this.popupElement.querySelector(
      ".member-list"
    ) as HTMLElement;

    // Clear current list
    while (memberList.firstChild) {
      memberList.removeChild(memberList.firstChild);
    }

    // Filter and render items based on search term
    if (this.popupState === "team") {
      const filteredTeams = this.allTeamsArray.filter((team: any) =>
        team.teamName.toLowerCase().includes(searchTerm)
      );
      this.renderItems(filteredTeams).forEach((item) =>
        memberList.appendChild(item)
      );
    } else {
      const filteredUsers = this.allUsersArray.filter(
        (user: User) =>
          user.username.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
      );
      this.renderItems(filteredUsers).forEach((item) =>
        memberList.appendChild(item)
      );
    }
  }

  //API CALLS--------------------------------------------------------
  async getAllUsers() {
    let apiCall = new ProjectsService("http://localhost:3000/get-all-users");
    const result = await apiCall.getAllUsers(this.members);

    (result as User[]).forEach((item) => this.allUsersArray.push(item));
  }

  async getAllTeams() {
    let result = await new ProjectsService(
      `http://localhost:3000/get-all-user-teams`
    ).getAllTeams();
    result.forEach((item: any) => this.allTeamsArray.push(item));
    result = null;
  }
}
