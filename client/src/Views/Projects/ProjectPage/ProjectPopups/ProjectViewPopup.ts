import { ProjectView } from "../ProjectView";
import "../../../../Styles/SharedStylings/Popup.css";
import { ProjectViewTaskPopup } from "./ProjectViewTaskPopup";
import { ProjectViewMemberPopup } from "./ProjectViewMemberPopup";
import { store } from "../../../../Store/Store";
import { createPopupModal } from "../../../../Components/PopupModal";
import { MembersData } from "../../../../Types/ProjectsTypes";

export class ProjectPopupView extends ProjectView {
  taskTitle: string = "";
  taskDescription: string = "";
  taskDeadline: Date = new Date();
  taskAssignedMember: string = "";
  setProjectDataOnParentController: (newMembers: MembersData[]) => void;
  renderProjectMember: () => void;
  fetchUserProject: () => Promise<void>;
  renderProjectTask: () => void;
  handleClosePopup: () => void;
  handleManagerClassReset: () => Promise<void>;
  constructor(
    popupState: string = "",
    projectId: string = "",
    members: string[],
    setProjectDataOnParentController: (newMembers: MembersData[]) => void,
    renderProjectMember: () => void,
    fetchUserProject: () => Promise<void>,
    renderProjectTask: () => void,
    membersData: MembersData[],
    handleClosePopup: () => void,
    handleManagerClassReset: () => Promise<void>
  ) {
    super();
    this.popupState = popupState;
    this.projectId = projectId;
    this.members = members;
    this.setProjectDataOnParentController = setProjectDataOnParentController;
    this.renderProjectMember = renderProjectMember;
    this.fetchUserProject = fetchUserProject;
    this.renderProjectTask = renderProjectTask;
    this.membersData = membersData;
    this.handleClosePopup = handleClosePopup;
    this.handleManagerClassReset = handleManagerClassReset;

    this.createModal();
  }

  createModal() {
    const popup = createPopupModal(this.handleClosePopup);

    if (this.popupState === "team")
      this.createMemberPopupController(popup.children[0]);
    if (this.popupState === "member")
      this.createMemberPopupController(popup.children[0]);
    if (this.popupState === "task")
      this.createTaskPopupController(popup.children[0].children[1]);

    store.getState().mainDivApp.appendChild(popup);
  }

  createMemberPopupController(popup: HTMLElement) {
    new ProjectViewMemberPopup(
      popup,
      "project",
      this.projectId,
      this.members,
      this.setProjectDataOnParentController,
      this.renderProjectMember,
      () => {},
      () => {},
      this.handleManagerClassReset
    );
  }

  createTaskPopupController(popup: HTMLElement) {
    new ProjectViewTaskPopup(
      popup,
      this.projectId,
      this.fetchUserProject,
      this.renderProjectTask,
      this.membersData,
      this.handleManagerClassReset
    );
  }
}
