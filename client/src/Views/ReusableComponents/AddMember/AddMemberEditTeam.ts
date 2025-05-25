import { TeamsService } from "../../../Services/TeamsService";
import { createElement } from "../../../Utils/Helpers";
import "../../../Styles/Views/Teams/Team/AddMemberEditTeam.css";

export class AddMemberEditTeam {
  popupElement: HTMLElement;
  selectedMember: string = "";
  teamId: string;
  handleManagerClassReset: () => Promise<void>;

  constructor(
    popupElement: HTMLElement,
    teamId: string,
    handleManagerClassReset: () => Promise<void>
  ) {
    this.popupElement = popupElement;
    this.teamId = teamId;
    this.handleManagerClassReset = handleManagerClassReset;
    this.createAddButtonElementForEveryMember();
    this.removeAddMemberTitle();
    // this.setMemberItemsClassnames();
  }

  removeAddMemberTitle() {
    setTimeout(() => {
      document.querySelector(".member-popup-title")?.remove();
    }, 20);
  }

  setMemberItemsClassnames() {
    const memberItems = this.popupElement.querySelectorAll(".member-item");
    memberItems.forEach((item) => {
      item.classList.add("member-item-team");
    });
  }

  createAddButtonElementForEveryMember() {
    setTimeout(() => {
      document.querySelectorAll(".member-item").forEach((member) => {
        const addButton = createElement({
          tag: "button",
          className: "add-member-button",
          text: "Add",
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
    memberItemDiv.style.justifyContent = "space-between";
  }

  selectMember(e: Event) {
    const target = e.target as HTMLElement;
    const targetElement = target.closest(".member-item") as HTMLElement;

    // Add loading state to button
    target.textContent = "Adding...";
    target.classList.add("adding");
    target.setAttribute("disabled", "true");

    this.selectedMember = targetElement.dataset.projectId as string;
    this.submitSelectedMember();
  }

  async submitSelectedMember() {
    try {
      await new TeamsService(
        `http://localhost:3000/team/${this.teamId}/add/member`
      ).addMemberToTeam({ selectedMember: this.selectedMember });

      this.handleManagerClassReset();
    } catch (error) {
      console.error("Error adding member:", error);

      // Reset buttons if there's an error
      document.querySelectorAll(".add-member-button.adding").forEach((btn) => {
        btn.textContent = "Add";
        btn.classList.remove("adding");
        btn.removeAttribute("disabled");
      });

      alert("Failed to add member. Please try again.");
    }
  }
}
