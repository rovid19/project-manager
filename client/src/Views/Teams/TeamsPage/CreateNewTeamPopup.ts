import { createPopupModal } from "../../../Components/PopupModal";
import { store } from "../../../Store/Store";
import { TeamsView } from "./TeamsView";
import { createElement } from "../../../Utils/Helpers";
import "../../../Styles/SharedStylings/Popup.css";
import "../../../Styles/Views/Teams/Team/TeamPopup.css";
import { AddMemberContainer } from "../../ReusableComponents/AddMember/AddMemberContainer.ts";
import { TeamsService } from "../../../Services/TeamsService";
import { userStore } from "../../../Store/UserStore";

export type SelectedMember = {
  element?: HTMLElement;
  userId: string;
  isAdmin: boolean;
};

export class CreateNewTeamPopup extends TeamsView {
  teamName: string = "";
  teamDescription: string = "";
  selectedMembers: SelectedMember[] = [];
  renderTeamCards: () => void = () => {};
  fetchAllTeams: () => Promise<void> = async () => {};

  constructor(renderTeamCards: () => void, fetchAllTeams: () => Promise<void>) {
    super();
    this.renderPopup();
    this.renderTeamCards = renderTeamCards;
    this.fetchAllTeams = fetchAllTeams;
  }

  //UI RENDER------------------------------------------------------
  renderPopup() {
    const popupOverlay = createPopupModal(this.handleClosePopup);

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
    this.setupAddMemberPopupClass(popupContent.children[1].children[2]);
    popupOverlay.querySelector(".popup-main-div")?.appendChild(popupContent);
    store.getState().mainDivApp.appendChild(popupOverlay);
  }

  //CORE LOGIC------------------------------------------------------
  setSelectedMembers = (selectedMembers: SelectedMember[]) => {
    this.selectedMembers = selectedMembers;
    console.log(this.selectedMembers);
  };

  setupAddMemberPopupClass(memberContainer: HTMLElement) {
    new AddMemberContainer(
      memberContainer,
      "",
      "createNewTeam",
      "",
      [],
      () => {},
      async () => {},
      this.setSelectedMembers,
      () => {}
    );
  }

  //API CALLS------------------------------------------------------
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
    ).createTeam({
      teamName: this.teamName,
      teamDescription: this.teamDescription,
      selectedMembers: this.selectedMembers,
    });

    await this.fetchAllTeams();

    this.deleteTeamCards();
    this.handleClosePopup();
    this.renderTeamCards();
  }

  //LISTENERS------------------------------------------------------
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
}
