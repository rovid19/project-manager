import { createPopupModal } from "../../Components/PopupModal";
import { store } from "../../Store/Store";
import { TeamsView } from "../App/TeamsView";
import { createElement } from "../../Utils/Helpers";
import "../../Styles/SharedStylings/Popup.css";
import "../../Styles/TeamPopup.css";
import { ProjectPopupMemberView } from "../ProjectPopupViews/ProjectPopupMemberView";

export class TeamsPopupView extends TeamsView {
  constructor() {
    super();
    this.createModal();
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
            }),
            createElement({
              tag: "textarea",
              className: "team-description-input",
              placeholder: "Team Description",
              rows: "2",
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
    this.renderAllMembers(popupContent.children[1].children[2]);
    popupOverlay.querySelector(".popup-main-div")?.appendChild(popupContent);
    store.getState().mainDivApp.appendChild(popupOverlay);
  }

  private renderAllMembers(memberContainer: HTMLElement) {
    new ProjectPopupMemberView(memberContainer);

    memberContainer.style.height = "20%";
  }

  private handleCreateTeam() {
    // Handle team creation logic here
    console.log("Creating team...");
    this.closePopup();
  }
}
