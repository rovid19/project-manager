import { ProjectsService } from "../../../Services/ProjectsService";
import { MembersData } from "../../../Types/ProjectsTypes";

export class AddMemberProjectPopup {
  popupElement: HTMLElement;
  view: string;
  projectId: string;
  members: any;
  selectedMemberId: string = "";
  setProjectDataOnParentController: (newMembers: MembersData[]) => void;
  handleManagerClassReset: () => void;
  closePopup: () => void;
  constructor(
    popupElement: HTMLElement,
    view: string,
    projectId: string,
    members: string[],
    setProjectDataOnParentController: (newMembers: MembersData[]) => void,
    handleManagerClassReset: () => void,
    closePopup: () => void
  ) {
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
    const target = e.target as HTMLElement;
    this.selectedMemberId = (target.closest(".member-item") as HTMLElement)
      .dataset.projectId as string;

    if (this.selectedMemberId && this.projectId) {
      await new ProjectsService(
        "http://localhost:3000/handle-add-member-to-project"
      ).handleAddMember(this.selectedMemberId, this.projectId);
      const result = await new ProjectsService(
        `http://localhost:3000/get-project/${this.projectId}`
      ).fetchUserProject();

      this.setProjectDataOnParentController(result.membersData);
      this.closePopup();
      this.handleManagerClassReset();
    } else {
      console.log(
        "something is missing",
        this.selectedMemberId,
        this.projectId
      );
    }
  };

  //LISTENERS------------------------------------------------------
  addCallbackToEveryMemberItem() {
    setTimeout(() => {
      document.querySelectorAll(".member-item").forEach((memberItem) => {
        (memberItem as HTMLElement).onclick = this.submitAddMember;
      });
    }, 100);
  }
}
