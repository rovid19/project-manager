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
    console.log(this.members);
  }

  //API CALLS--------------------------------------------------------
  submitAddMember = async (e: Event) => {
    e.preventDefault();
    this.selectMemberOrTeamId(e);

    if (this.selectedId && this.projectId) {
      await new ProjectsService(
        "http://localhost:3000/handle-add-member-to-project"
      ).handleAddMember(this.selectedId, this.projectId);

      this.closePopup();
      this.handleManagerClassReset();
    } else {
      console.log("something is missing", this.selectedId, this.projectId);
    }
  };

  submitAddTeam = async (e: Event) => {
    console.log(this.teamId);
    if (!this.teamId) {
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
        } else (memberItem as HTMLElement).onclick = this.submitAddMember;
      });
    }, 100);
  }
}
