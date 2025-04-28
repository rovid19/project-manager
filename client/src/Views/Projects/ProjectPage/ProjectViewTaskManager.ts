import { removeMemberBtn } from "../../../Assets/Icons";
import { ProjectsService } from "../../../Services/ProjectsService";
import { Task } from "../../../Types/ProjectsTypes";
import { createElement } from "../../../Utils/Helpers";
import { ProjectView } from "./ProjectView";

export class ProjectViewTaskManager extends ProjectView {
  projectTasks: Task[] = [];
  taskContainer: HTMLElement | null = null;
  popupState: string = "";
  projectContainerElement: HTMLElement | null = null;
  handleOpenPopup: () => void = () => {};
  handleChangePopupValue: (value: string) => void = () => {};
  fetchUserProject: () => Promise<void> = async () => {};
  handleManagerClassReset: () => Promise<void>;

  constructor(
    projectTasks: Task[],
    projectContainerElement: HTMLElement,
    fetchUserProject: () => Promise<void>,
    handleOpenPopup: () => void,
    handleChangePopupValue: (value: string) => void,
    handleManagerClassReset: () => Promise<void>
  ) {
    super();
    this.projectTasks = projectTasks;
    this.fetchUserProject = fetchUserProject;
    this.projectContainerElement = projectContainerElement;
    this.renderProjectTask(this.projectContainerElement);
    this.handleOpenPopup = handleOpenPopup;
    this.handleChangePopupValue = handleChangePopupValue;
    this.handleManagerClassReset = handleManagerClassReset;
  }

  //UI RENDER------------------------------------------------------
  renderProjectTasks = () => {
    // rerender tasks
    if (document.querySelector(".project-task-card")) {
      const allTasks = document.querySelectorAll(".project-task-card");
      allTasks.forEach((task) => {
        task.remove();
      });
      this.renderProjectTasks();
    }
    // render tasks
    else {
      (this.projectTasks as Task[]).forEach((task) => {
        const element = createElement({
          tag: "div",
          className: "project-task-card",
          data: task.taskId,
          children: [
            createElement({
              tag: "div",
              className: "task-header",
              children: [
                createElement({
                  tag: "h3",
                  className: "task-title",
                  text: task.title,
                }),
                createElement({
                  tag: "div",
                  className: "remove-task-btn",
                  innerHTML: removeMemberBtn,
                  onClick: () => {
                    this.removeTaskFromProject(task.taskId);
                    this.cardDeleteAni(element);
                  },
                }),
              ],
            }),
            createElement({
              tag: "div",
              className: "task-info",
              children: [
                createElement({
                  tag: "div",
                  className: "task-assignee",
                  children: [
                    createElement({
                      tag: "span",
                      className: "task-label",
                      text: "Assigned to:",
                    }),
                    createElement({
                      tag: "span",
                      className: "task-assigned-user",
                      text: task.username,
                    }),
                  ],
                }),
                createElement({
                  tag: "div",
                  className: "task-deadline",
                  children: [
                    createElement({
                      tag: "span",
                      className: "task-label",
                      text: "Deadline:",
                    }),
                    createElement({
                      tag: "span",
                      className: "task-date",
                      text: new Date(task.deadline).toLocaleDateString(),
                    }),
                  ],
                }),
              ],
            }),
          ],
        });

        (this.taskContainer as HTMLElement).appendChild(element);
      });
    }
  };

  renderProjectTask(mainSection: HTMLElement) {
    const tasksDiv = createElement({
      tag: "div",
      className: "project-task-section",
      children: [
        createElement({
          tag: "button",
          className: "project-add-task-btn",
          innerText: "Add Task",
          onClick: (e: Event) => {
            e.preventDefault();
            this.handleChangePopupValue("task");
            this.handleOpenPopup();
          },
        }),
      ],
    });

    this.taskContainer = tasksDiv;
    this.renderProjectTasks();
    mainSection.appendChild(tasksDiv);
  }

  //API CALLS------------------------------------------------------
  async removeTaskFromProject(taskId: string) {
    await new ProjectsService(
      "http://localhost:3000/handle-remove-task"
    ).removeTaskFromProject(taskId);

    await this.fetchUserProject();
    setTimeout(() => {
      this.handleManagerClassReset();
    }, 300);
  }
}
