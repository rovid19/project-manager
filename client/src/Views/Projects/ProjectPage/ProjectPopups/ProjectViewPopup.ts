import { ProjectView } from "../ProjectView";
import "../../../../Styles/SharedStylings/Popup.css";
import { ProjectTaskPopup } from "./ProjectTaskPopup";
import { AddMemberContainer } from "../../../ReusableComponents/AddMember/AddMemberContainer.ts";
import { store } from "../../../../Store/Store";
import { createPopupModal } from "../../../../Components/PopupModal";
import { MembersData } from "../../../../Types/ProjectsTypes";

export class ProjectViewPopup extends ProjectView {
  /*taskTitle: string = "";
  taskDescription: string = "";
  taskDeadline: Date = new Date();
  taskAssignedMember: string = "";*/
  setProjectDataOnParentController: (newMembers: MembersData[]) => void;
  fetchUserProject: () => Promise<void>;
  closePopup: () => void;
  handleManagerClassReset: () => Promise<void>;
  constructor(
    popupState: string = "",
    projectId: string = "",
    members: string[],
    setProjectDataOnParentController: (newMembers: MembersData[]) => void,
    fetchUserProject: () => Promise<void>,
    membersData: MembersData[],
    closePopup: () => void,
    handleManagerClassReset: () => Promise<void>
  ) {
    super();
    this.popupState = popupState;
    this.projectId = projectId;
    this.members = members;
    this.setProjectDataOnParentController = setProjectDataOnParentController;
    this.fetchUserProject = fetchUserProject;
    this.membersData = membersData;
    this.closePopup = closePopup;
    this.handleManagerClassReset = handleManagerClassReset;

    this.createModal();
  }

  createModal() {
    const popup = createPopupModal(this.closePopup);

    if (this.popupState === "team") {
      console.log("team");
      this.createMemberPopupController(popup.children[0]);
    }
    if (this.popupState === "member") {
      this.createMemberPopupController(popup.children[0]);
      console.log("member");
    }
    if (this.popupState === "task") {
      console.log("task");
      this.createTaskPopupController(popup.children[0].children[1]);
    }
    store.getState().mainDivApp.appendChild(popup);
  }

  createMemberPopupController(popup: HTMLElement) {
    new AddMemberContainer(
      popup,
      "",
      "project",
      this.projectId,
      this.members,
      this.setProjectDataOnParentController,
      this.handleManagerClassReset,
      () => {},
      this.closePopup
    );
  }

  createTaskPopupController(popup: HTMLElement) {
    new ProjectTaskPopup(
      popup,
      this.projectId,
      this.fetchUserProject,
      this.membersData,
      this.handleManagerClassReset
    );
  }
}
