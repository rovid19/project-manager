import { createElement } from "../../Utils/Helpers";
import { ProjectController } from "./ProjectController";
import "../../Styles/ProjectPopup.css";
import { store } from "../../Store/Store";
import { closeModalBtn } from "../../Assets/Icons";

export class ProjectPopupController extends ProjectController {
  taskTitle: string = "";
  taskDescription: string = "";
  taskDeadline: string = "";
  taskAssignedMember: string = "";
  constructor(popupState: string) {
    super();
    this.popupState = popupState;

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

    if (this.popupState === "team") this.createTeamPopup;
    if (this.popupState === "member") this.createMemberPopup;
    if (this.popupState === "task") this.createTaskPopup(popup);

    currentState.mainDivApp.appendChild(popupOverlay);
    popupOverlay.appendChild(popup);
  }

  createTeamPopup() {}

  createMemberPopup() {}

  createTaskPopup(mainDiv: HTMLElement) {
    console.log(mainDiv);
    const taskForm = createElement({
      tag: "form",
      className: "task-popup-form",
      children: [
        createElement({
          tag: "h3",
          className: "task-popup-title",
          text: "Create New Task",
        }),
        createElement({
          tag: "div",
          className: "input-group",
          children: [
            createElement({
              tag: "label",
              className: "input-label",
              text: "Task Title",
            }),
            createElement({
              tag: "input",
              className: "task-title-input",
              name: "title",
              placeholder: "Enter task title",
              type: "text",
            }),
          ],
        }),
        createElement({
          tag: "div",
          className: "input-group",
          children: [
            createElement({
              tag: "label",
              className: "input-label",
              text: "Task Description",
            }),
            createElement({
              tag: "textarea",
              className: "task-description-input",
              name: "description",
              placeholder: "Enter task description",
              rows: "4",
            }),
          ],
        }),

        createElement({
          tag: "div",
          className: "input-group",
          children: [
            createElement({
              tag: "label",
              className: "input-label",
              text: "Task deadline",
            }),
            createElement({
              tag: "input",
              className: "task-deadline-input",
              name: "deadline",
              type: "date",
              placeholder: "Task Deadline",
            }),
          ],
        }),
        createElement({
          tag: "div",
          className: "input-group",
          children: [
            createElement({
              tag: "label",
              className: "input-label",
              text: "Assign task to:",
            }),
            createElement({
              tag: "select",
              className: "task-assignee-select",
              name: "assignedMember",
              children: [
                createElement({
                  tag: "option",
                  value: "",
                  text: "Select Team Member",
                  disabled: true,
                  selected: true,
                }),
              ],
            }),
          ],
        }),

        createElement({
          tag: "button",
          className: "create-task-btn",
          type: "submit",
          text: "Create Task",
          onClick: (e: Event) => {
            e.preventDefault();
            this.handleTaskSubmit(e);
          },
        }),
      ],
    });

    mainDiv.appendChild(taskForm);
    this.taskFormDelegation(taskForm);
  }

  private handleTaskSubmit(e: Event) {
    e.preventDefault();
    console.log({
      title: this.taskTitle,
      description: this.taskDescription,
      deadline: this.taskDeadline,
      assignee: this.taskAssignedMember,
    });
  }

  private taskFormDelegation(form: HTMLElement) {
    form.addEventListener("change", (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.matches("input, textarea, select")) {
        switch (target.name) {
          case "title":
            this.taskTitle = target.value;
            break;
          case "description":
            this.taskDescription = target.value;
            break;
          case "deadline":
            this.taskDeadline = target.value;
            console.log(target.value);
            break;
          case "assignedMember":
            this.taskAssignedMember = target.value;
            break;
        }
      }
    });
  }
}
