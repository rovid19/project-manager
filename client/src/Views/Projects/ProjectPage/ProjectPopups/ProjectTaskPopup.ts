import { TaskService } from "../../../../Services/TaskService";
import { createElement } from "../../../../Utils/Helpers";
import "../../../../Styles/Views/Projects/Project/ProjectPopup.css";
import { MembersData } from "../../../../Types/ProjectsTypes";

export class ProjectTaskPopup {
  title: string = "";
  description: string = "";
  deadline: Date = new Date();
  assignee: string = "";
  projectId: string = "";
  popupElement: HTMLElement | null = null;
  membersData: MembersData[] | null = null;
  handleManagerClassReset: () => void = () => {};
  fetchUserProject: () => Promise<void> = async () => {};

  constructor(
    popup: HTMLElement,
    projectId: string,
    fetchUserProject: () => Promise<void>,
    membersData: MembersData[],
    handleManagerClassReset: () => void
  ) {
    this.popupElement = popup;
    this.projectId = projectId;
    this.membersData = membersData;
    this.createTaskPopup(this.popupElement);
    this.fetchUserProject = fetchUserProject;
    this.handleManagerClassReset = handleManagerClassReset;
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
                  onChange: () => {
                    console.log("changed");
                  },
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
            this.handleCreateNewTask(e);
          },
        }),
      ],
    });

    this.renderMemberInSelectDropdown(taskForm.children[4].children[1]);
    mainDiv.appendChild(taskForm);
    this.setupTaskFormEventDelegation(taskForm);
  }

  private handleIdSort(assigneeUsername: string) {
    this.membersData?.find((member) => {
      if (member.username === assigneeUsername) {
        this.assignee = member.userId;
      }
    });
  }

  private handleDeleteTaskPopup() {
    document.querySelector(".popup-overlay")?.remove();
  }

  private renderMemberInSelectDropdown(selectElement: HTMLSelectElement) {
    this.membersData?.forEach((member) => {
      const element = createElement({
        tag: "option",
        className: "select-option",
        value: member.username,
        text: member.username,
        disabled: false,
        data: member.username,
      });

      selectElement.appendChild(element);
    });
  }

  private async handleCreateNewTask(e: Event) {
    e.preventDefault();
    let apiCall: TaskService | null = new TaskService(
      `http://localhost:3000/create-new-task`
    );
    await apiCall.handleTaskCreation({
      title: this.title,
      description: this.description,
      deadline: this.deadline,
      assignee: this.assignee,
      projectId: this.projectId,
    });

    apiCall = null;

    this.handleDeleteTaskPopup();
    this.handleManagerClassReset();
  }

  private setupTaskFormEventDelegation(form: HTMLElement) {
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
            this.handleIdSort(target.value);
            break;
        }
      }
    });
  }
}
