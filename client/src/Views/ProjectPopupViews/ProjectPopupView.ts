import { MembersData, ProjectView } from "../App/ProjectView";
import "../../Styles/SharedStylings/Popup.css";
import { ProjectPopupTaskView } from "./ProjectPopupTaskView";
import { ProjectPopupMemberView } from "./ProjectPopupMemberView";
import { ProjectData } from "../../Store/UserStore";
import { store } from "../../Store/Store";
import { createPopupModal } from "../../Components/PopupModal";

export class ProjectPopupView extends ProjectView {
  taskTitle: string = "";
  taskDescription: string = "";
  taskDeadline: Date = new Date();
  taskAssignedMember: string = "";

  //metode sa parenta
  setProjectDataOnParentController: (projectData: ProjectData) => void =
    () => {};
  renderProjectMember: () => void = () => {};
  fetchUserProject: () => Promise<void> = async () => {};
  renderProjectTask: () => void = () => {};

  constructor(
    popupState: string = "",
    projectId: string = "",
    members: string[],
    setProjectDataOnParentController: (projectData: ProjectData) => void,
    renderProjectMember: () => void,
    fetchUserProject: () => Promise<void>,
    renderProjectTask: () => void,
    membersData: MembersData[]
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

    this.createModal();
    console.log(typeof this.members);
  }

  createModal() {
    const popup = createPopupModal(this.closePopup);

    if (this.popupState === "team") this.createMemberPopupController(popup);
    if (this.popupState === "member")
      this.createMemberPopupController(popup.children[0]);
    if (this.popupState === "task") this.createTaskPopupController(popup);

    store.getState().mainDivApp.appendChild(popup);
  }

  createMemberPopupController(popup: HTMLElement) {
    new ProjectPopupMemberView(
      popup,
      this.projectId,
      this.members,
      this.setProjectDataOnParentController,
      this.renderProjectMember
    );
  }

  createTaskPopupController(popup: HTMLElement) {
    new ProjectPopupTaskView(
      popup,
      this.projectId,
      this.fetchUserProject,
      this.renderProjectTask,
      this.membersData
    );
  }
}
