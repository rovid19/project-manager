import { TeamsService } from "../../../Services/TeamsService";
import { createElement } from "../../../Utils/Helpers";
import "../../../Styles/Views/Teams/Team/AddMemberEditTeam.css";

export class AddMemberEditTeam {
  popupElement: HTMLElement;
  selectedMember: string = "";
  teamId: string;
  handleManagerClassReset: () => void;

  constructor(
    popupElement: HTMLElement,
    teamId: string,
    handleManagerClassReset: () => void
  ) {
    this.popupElement = popupElement;
    this.teamId = teamId;
    this.handleManagerClassReset = handleManagerClassReset;
    this.createAddButtonElementForEveryMember();
    console.log(this.teamId);
  }

  createAddButtonElementForEveryMember() {
    setTimeout(() => {
      document.querySelectorAll(".member-item").forEach((member) => {
        console.log(member);
        const addButton = createElement({
          tag: "button",
          className: "add-member-button",
          text: "Add Member",
          onclick: (e: Event) => {
            e.preventDefault();
            this.selectMember(e);
          },
        });

        member.appendChild(addButton);
        this.setCustomCssForMemberItemDiv(member as HTMLElement);
      });
    }, 100);
  }

  setCustomCssForMemberItemDiv(memberItemDiv: HTMLElement) {
    memberItemDiv.style.cursor = "default";
  }

  selectMember(e: Event) {
    console.log("ojla");
    const target = e.target as HTMLElement;
    const targetElement = target.closest(".member-item") as HTMLElement;

    this.selectedMember = targetElement.dataset.projectId as string;

    this.submitSelectedMember();
  }

  async submitSelectedMember() {
    console.log(this.teamId);
    await new TeamsService(
      `http://localhost:3000/team/${this.teamId}/add/member`
    ).addMemberToTeam({ selectedMember: this.selectedMember });

    this.handleManagerClassReset();
  }
}
