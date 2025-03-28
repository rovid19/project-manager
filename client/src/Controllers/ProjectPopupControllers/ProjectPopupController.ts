import { createElement } from "../../Utils/Helpers";
import { ProjectController } from "../App/ProjectController";
import "../../Styles/ProjectPopup.css";
import { store } from "../../Store/Store";
import { closeModalBtn } from "../../Assets/Icons";
import { ProjectPopupTaskController } from "./ProjectPopupTaskController";
import { ProjectPopupMemberController } from "./ProjectPopupMemberController";

export class ProjectPopupController extends ProjectController {
  taskTitle: string = "";
  taskDescription: string = "";
  taskDeadline: Date = new Date();
  taskAssignedMember: string = "";

  constructor(
    popupState: string = "",
    projectId: string = "",
    members: string[]
  ) {
    super();
    this.popupState = popupState;
    this.projectId = projectId;
    this.members = members;
    this.createModal();
  }

  createModal() {
    const currentState = store.getState();
    const popupOverlay = createElement({
      tag: "div",
      className: "popup-overlay",
    });

    const popup = createElement({
      tag: "div",
      className: "project-popup",
      children: [
        createElement({
          tag: "div",
          className: "popup-close-div",
          innerHTML: closeModalBtn,
          onClick: (e: Event) => {
            this.closePopup();
          },
        }),
        createElement({ tag: "div", className: "popup-main-div" }),
      ],
    });

    if (this.popupState === "team") this.createMemberPopupController(popup);
    if (this.popupState === "member")
      this.createMemberPopupController(popup.children[1]);
    if (this.popupState === "task") this.createTaskPopupController(popup);

    currentState.mainDivApp.appendChild(popupOverlay);
    popupOverlay.appendChild(popup);
  }

  createMemberPopupController(popup: HTMLElement) {
    new ProjectPopupMemberController(popup, this.projectId, this.members);
  }

  createTaskPopupController(popup: HTMLElement) {
    new ProjectPopupTaskController(popup, this.projectId);
  }
}
