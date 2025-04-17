import { createPopupModal } from "../../Components/PopupModal";
import { store } from "../../Store/Store";
import { TeamsView } from "../App/TeamsView";
import { createElement } from "../../Utils/Helpers";
import "../../Styles/SharedStylings/Popup.css";
import "../../Styles/TeamPopup.css";
import {
  ProjectPopupMemberView,
  User,
} from "../ProjectPopupViews/ProjectPopupMemberView";
import { TeamsService } from "../../Services/TeamsService";
import { userStore } from "../../Store/UserStore";

export type SelectedMember = {
  element?: HTMLElement;
  userId: string;
  isAdmin: boolean;
};

export class TeamsPopupView extends TeamsView {
  memberContainer: HTMLElement | null = null;
  teamName: string = "";
  teamDescription: string = "";
  selectedMembers: SelectedMember[] = [];
  allMembers: string[] = [];

  renderTeamCards: () => void = () => {};
  fetchAllTeams: () => Promise<void> = async () => {};

  constructor(renderTeamCards: () => void, fetchAllTeams: () => Promise<void>) {
    super();
    this.createModal();
    this.renderTeamCards = renderTeamCards;
    this.fetchAllTeams = fetchAllTeams;
  }

  createModal() {
    const popupOverlay = createPopupModal(this.closePopup);

    const popupContent = createElement({
      tag: "div",
      className: "popup-content",
      children: [
        createElement({
          tag: "h2",
          className: "team-popup-title",
          text: "Create New Team",
        }),
        createElement({
          tag: "form",
          className: "team-popup-form",
          children: [
            createElement({
              tag: "input",
              className: "team-name-input",
              type: "text",
              placeholder: "Team Name",
              required: true,
              name: "teamName",
            }),
            createElement({
              tag: "textarea",
              className: "team-description-input",
              placeholder: "Team Description",
              rows: "2",
              name: "teamDescription",
            }),
            createElement({
              tag: "div",
              className: "team-members-container",
              id: "team-members-container",
            }),
            createElement({
              tag: "button",
              className: "create-team-btn",
              type: "submit",
              text: "Create Team",
              onClick: (e: Event) => {
                e.preventDefault();
                this.handleCreateTeam();
              },
            }),
          ],
        }),
      ],
    });

    this.formEventDelegation(popupContent.children[1]);
    this.renderAllMembers(popupContent.children[1].children[2]);
    popupOverlay.querySelector(".popup-main-div")?.appendChild(popupContent);
    store.getState().mainDivApp.appendChild(popupOverlay);
  }

  private renderAllMembers(memberContainer: HTMLElement) {
    new ProjectPopupMemberView(
      memberContainer,
      "team",
      "",
      [],
      () => {},
      () => {},
      this.handleSelectMember,
      this.setAllMembers
    );
    this.memberContainer = memberContainer;
  }

  private formEventDelegation(form: HTMLFormElement) {
    form.addEventListener("change", (e: Event) => {
      const target = e.target as HTMLInputElement;

      if (target.matches("input")) {
        switch (target.name) {
          case "teamName":
            this.teamName = target.value;
            break;
          case "teamDescription":
            this.teamDescription = target.value;
            break;
        }
      }
    });
  }

  private async handleCreateTeam() {
    // izbacujem element iz selecctedMembers arraya, ostale propertije ostavljam
    this.selectedMembers = this.selectedMembers.map(
      ({ element, ...rest }) => rest
    );
    // dodajem usera koji kreaira team unutar selectedMembers arraya
    this.selectedMembers.push({
      userId: userStore.getState().userId,
      isAdmin: true,
    });

    await new TeamsService(
      "http://localhost:3000/handle-create-team"
    ).handleCreateTeam({
      teamName: this.teamName,
      teamDescription: this.teamDescription,
      selectedMembers: this.selectedMembers,
    });

    await this.fetchAllTeams();

    this.deleteTeamCards();
    this.closePopup();
    this.renderTeamCards();
  }

  setAllMembers = (userArray: User[]) => {
    userArray.forEach((user) => this.allMembers.push(user.userId));
  };

  handleSelectMember = (e: Event) => {
    const target = e.target as HTMLElement;
    const memberElement = target.closest(".member-item") as HTMLElement;
    const userId = (target.closest(".member-item") as HTMLElement).dataset
      .projectId as string;

    if (this.selectedMembers.some((member) => member.userId === userId)) {
      //remove border from selected member element
      const index = this.selectedMembers.findIndex(
        (member) => member.userId === userId
      );
      this.handleMakeElementSelection(
        this.selectedMembers[index].element as HTMLElement,
        "remove"
      );

      //remove member from selectedMembers
      this.selectedMembers = this.selectedMembers.filter(
        (member) => member.userId !== userId
      );
    } else {
      //add member to selectedMembers
      this.selectedMembers.push({
        element: memberElement,
        userId: userId,
        isAdmin: false,
      });

      //add border to selected member element
      const index = this.selectedMembers.findIndex(
        (member) => member.userId === userId
      );
      this.handleMakeElementSelection(
        this.selectedMembers[index].element as HTMLElement,
        "add"
      );
    }
  };

  handleMakeElementSelection(memberElement: HTMLElement, action: string) {
    if (action === "add") memberElement.style.border = "2px solid green";
    else memberElement.style.border = "";
  }
}
