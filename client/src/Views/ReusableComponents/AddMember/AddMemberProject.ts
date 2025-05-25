import { ProjectsService } from "../../../Services/ProjectsService";
import { MembersData } from "../../../Types/ProjectsTypes";

export class AddMemberProjectPopup {
  popupState: string = "";
  popupElement: HTMLElement;
  view: string;
  projectId: string;
  teamId: string;
  members: any;
  selectedId: string = "";
  setProjectDataOnParentController: (newMembers: MembersData[]) => void;
  handleManagerClassReset: () => void;
  closePopup: () => void;
  constructor(
    popupState: string,
    popupElement: HTMLElement,
    teamId: string,
    view: string,
    projectId: string,
    members: string[],
    setProjectDataOnParentController: (newMembers: MembersData[]) => void,
    handleManagerClassReset: () => void,
    closePopup: () => void
  ) {
    (this.popupState = popupState),
      (this.popupElement = popupElement),
      (this.teamId = teamId),
      (this.view = view),
      (this.projectId = projectId),
      (this.members = members);
    (this.setProjectDataOnParentController = setProjectDataOnParentController),
      (this.handleManagerClassReset = handleManagerClassReset),
      (this.closePopup = closePopup);

    this.addCallbackToEveryMemberItem();
  }

  //API CALLS--------------------------------------------------------

  submitAddTeam = async (e: Event) => {
    const element = (e.target as HTMLElement).closest(
      ".member-item"
    ) as HTMLElement | null;
    const teamId = element?.dataset.projectId ?? "";

    if (this.teamId === "noTeam") {
      e.preventDefault();
      this.selectMemberOrTeamId(e);

      if (this.selectedId && this.projectId) {
        await new ProjectsService(
          `http://localhost:3000/projects/${this.projectId}/add/team `
        ).addTeam(this.selectedId);
      } else {
        console.log("no team, member or project id");
      }

      this.closePopup();
      history.pushState("", "", `/projects/${this.projectId}/${teamId}`);
      this.handleManagerClassReset();
    } else {
      alert("your project must no have any members in order to add a team");
    }
  };

  selectMemberOrTeamId(e: Event) {
    const target = e.target as HTMLElement;
    this.selectedId = (target.closest(".member-item") as HTMLElement).dataset
      .projectId as string;
  }

  //LISTENERS------------------------------------------------------
  addCallbackToEveryMemberItem() {
    setTimeout(() => {
      document.querySelectorAll(".member-item").forEach((memberItem) => {
        if (this.popupState === "team") {
          (memberItem as HTMLElement).onclick = this.submitAddTeam;
        }
      });
    }, 100);
  }
}
