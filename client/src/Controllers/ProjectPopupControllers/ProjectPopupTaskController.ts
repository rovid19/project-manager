import { TaskService } from "../../Services/TaskService";
import { userStore } from "../../Store/UserStore";
import { createElement } from "../../Utils/Helpers";

export class ProjectPopupTaskController {
  title: string = "";
  description: string = "";
  deadline: Date = new Date();
  assignee: string = "";
  projectId: string = "";
  popupElement: HTMLElement | null = null;

  //prop drilling
  fetchUserProject: () => Promise<void> = async () => {};
  renderProjectTask: () => void = () => {};

  constructor(
    popup: HTMLElement,
    projectId: string,
    fetchUserProject: () => Promise<void>,
    renderProjectTask: () => void
  ) {
    this.popupElement = popup;
    this.projectId = projectId;
    this.createTaskPopup(this.popupElement);
    this.fetchUserProject = fetchUserProject;
    this.renderProjectTask = renderProjectTask;
  }

  createTaskPopup(mainDiv: HTMLElement) {
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

  private deleteTaskPopup() {
    document.querySelector(".popup-overlay")?.remove();
  }

  private async handleTaskSubmit(e: Event) {
    e.preventDefault();
    let apiCall: TaskService | null = new TaskService(
      `http://localhost:3000/create-new-task`
    );
    await apiCall.handleTaskCreation({
      title: this.title,
      description: this.description,
      deadline: this.deadline,
      assignee: userStore.getState().userId,
      projectId: this.projectId,
    });

    apiCall = null;

    this.deleteTaskPopup();
    await this.fetchUserProject();
    this.renderProjectTask();
  }

  private taskFormDelegation(form: HTMLElement) {
    form.addEventListener("change", (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.matches("input, textarea, select")) {
        switch (target.name) {
          case "title":
            this.title = target.value;
            break;
          case "description":
            this.description = target.value;
            break;
          case "deadline":
            this.deadline = new Date(target.value);
            break;
          case "assignedMember":
            this.assignee = target.value;
            break;
        }
      }
    });
  }

  fetchAllTasks() {}
}
