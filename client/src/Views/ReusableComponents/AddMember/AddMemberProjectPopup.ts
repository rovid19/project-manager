import { ProjectsService } from "../../../Services/ProjectsService";
import { MembersData } from "../../../Types/ProjectsTypes";
import { createElement } from "../../../Utils/Helpers";

export class AddMemberProjectPopup {
  popupState: string = "";
  popupElement: HTMLElement;
  view: string;
  projectId: string;
  members: any;
  selectedId: string = "";
  setProjectDataOnParentController: (newMembers: MembersData[]) => void;
  handleManagerClassReset: () => void;
  closePopup: () => void;
  constructor(
    popupState: string,
    popupElement: HTMLElement,
    view: string,
    projectId: string,
    members: string[],
    setProjectDataOnParentController: (newMembers: MembersData[]) => void,
    handleManagerClassReset: () => void,
    closePopup: () => void
  ) {
    (this.popupState = popupState),
      (this.popupElement = popupElement),
      (this.view = view),
      (this.projectId = projectId),
      (this.members = members);
    (this.setProjectDataOnParentController = setProjectDataOnParentController),
      (this.handleManagerClassReset = handleManagerClassReset),
      (this.closePopup = closePopup);

    this.addCallbackToEveryMemberItem();
  }

  //API CALLS--------------------------------------------------------
  submitAddMember = async (e: Event) => {
    e.preventDefault();
    this.selectMemberOrTeamId(e);

    if (this.selectedId && this.projectId) {
      await new ProjectsService(
        "http://localhost:3000/handle-add-member-to-project"
      ).handleAddMember(this.selectedId, this.projectId);
      /* const result = await new ProjectsService(
        `http://localhost:3000/get-project/${this.projectId}`
      ).fetchUserProject();*/

      // this.setProjectDataOnParentController(result.membersData);
      this.closePopup();
      this.handleManagerClassReset();
    } else {
      console.log("something is missing", this.selectedId, this.projectId);
    }
  };

  async submitAddTeam(e: Event) {
    e.preventDefault();
    if (this.selectedId && this.projectId) {
      await new ProjectsService(
        `http://localhost:3000/projects/${this.projectId}/add/team `
      ).addTeam(this.selectedId);
    } else {
      console.log("no team, member or project id");
    }

    this.closePopup();
    this.handleManagerClassReset();
  }

  selectMemberOrTeamId(e: Event) {
    const target = e.target as HTMLElement;
    this.selectedId = (target.closest(".member-item") as HTMLElement).dataset
      .projectId as string;
  }

  //LISTENERS------------------------------------------------------
  addCallbackToEveryMemberItem() {
    setTimeout(() => {
      document.querySelectorAll(".member-item").forEach((memberItem) => {
        if (this.popupState === "team") console.log();
        else (memberItem as HTMLElement).onclick = this.submitAddMember;
      });
    }, 100);
  }
}
